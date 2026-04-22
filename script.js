// Backend Simulation Service
const CalculationService = {
    // Formula: Heron's Formula
    calculateTriangleArea: (a, b, c) => {
        if (a + b <= c || a + c <= b || b + c <= a) return 0;
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return isNaN(area) ? 0 : area;
    },

    saveRecord: (data) => {
        const history = JSON.parse(localStorage.getItem('calc_history') || '[]');
        history.unshift({
            id: Date.now(),
            date: new Date().toLocaleString('ar-EG'),
            total: data.total.toFixed(2),
            details: data.details
        });
        localStorage.setItem('calc_history', JSON.stringify(history.slice(0, 10)));
    },

    getHistory: () => {
        return JSON.parse(localStorage.getItem('calc_history') || '[]');
    }
};

const DrawService = {
    drawLand: (canvasId, t1, t2) => {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth * 2;
        const h = canvas.height = canvas.offsetHeight * 2;

        ctx.clearRect(0, 0, w, h);

        if (!t1.x || !t1.y || !t1.z) return;

        // Scale factor calculation
        const allSides = [t1.x, t1.y, t1.z, t2.x, t2.y, t2.z].filter(s => s > 0);
        const maxDim = Math.max(...allSides);
        const scale = (w * 0.7) / (maxDim || 1);
        const centerX = w / 2;
        const centerY = h / 2;

        const drawLabel = (p1, p2, text, color) => {
            ctx.font = 'bold 22px Cairo';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const offsetX = 30 * Math.sin(angle);
            const offsetY = -30 * Math.cos(angle);

            ctx.fillText(`${text}م`, midX + offsetX, midY + offsetY);
        };

        const drawVertex = (p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const drawArrow = (p1, p2, color) => {
            const headlen = 15;
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p2.x - headlen * Math.cos(angle - Math.PI / 6), p2.y - headlen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(p2.x - headlen * Math.cos(angle + Math.PI / 6), p2.y - headlen * Math.sin(angle + Math.PI / 6));
            ctx.lineTo(p2.x, p2.y);
            ctx.fillStyle = color;
            ctx.fill();
        };

        // Geometry (Common side Z is the diagonal)
        const cosA1 = (t1.z * t1.z + t1.x * t1.x - t1.y * t1.y) / (2 * t1.z * t1.x);
        const angleA1 = Math.acos(Math.max(-1, Math.min(1, cosA1)));

        const p_diag_start = { x: 0, y: 0 };
        const p_diag_end = { x: t1.z * scale, y: 0 };
        const p_top = { x: t1.x * scale * Math.cos(angleA1), y: -t1.x * scale * Math.sin(angleA1) };

        const e = t2.x, r = t2.y, i = t2.z;
        const cosSubA = (t1.z * t1.z + e * e - r * r) / (2 * t1.z * e);
        const angleSubA = Math.acos(Math.max(-1, Math.min(1, cosSubA)));
        const p_bottom = { x: e * scale * Math.cos(angleSubA), y: e * scale * Math.sin(angleSubA) };

        // Center the shape
        ctx.save();
        ctx.translate(centerX - (t1.z * scale / 2), centerY);

        // 1. Draw Outer Borders (Green)
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p_top.x, p_top.y);
        ctx.lineTo(p_diag_end.x, p_diag_end.y);
        if (e > 0) ctx.lineTo(p_bottom.x, p_bottom.y);
        ctx.lineTo(p_diag_start.x, p_diag_start.y);
        ctx.closePath();
        ctx.stroke();

        // 2. Draw Diagonal (Blue with Arrow)
        drawArrow(p_top, p_diag_end, '#2196F3');

        // 3. Draw Labels
        drawLabel(p_diag_start, p_top, t1.x, '#4CAF50');
        drawLabel(p_top, p_diag_end, t1.y, '#4CAF50');
        if (e > 0) {
            drawLabel(p_diag_end, p_bottom, r, '#4CAF50');
            drawLabel(p_bottom, p_diag_start, e, '#4CAF50');
        }

        // Diagonal Label
        ctx.save();
        ctx.translate((p_top.x + p_diag_end.x) / 2, (p_top.y + p_diag_end.y) / 2);
        // Special label for diagonal if needed, but per image let's just label sides
        ctx.restore();

        // 4. Draw Vertices (Dots)
        drawVertex(p_top);
        drawVertex(p_diag_end);
        drawVertex(p_diag_start);
        if (e > 0) drawVertex(p_bottom);

        ctx.restore();
    }
};

// UI Controller
const UI = {
    init: () => {
        UI.bindEvents();
        UI.renderHistory();
    },

    bindEvents: () => {
        document.getElementById('calculateBtn').addEventListener('click', UI.handleCalculate);
        document.getElementById('clearHistory').addEventListener('click', () => {
            localStorage.removeItem('calc_history');
            UI.renderHistory();
        });

        // Real-time calculation for individual triangles
        ['1', '2'].forEach(id => {
            ['x', 'y', 'z'].forEach(side => {
                document.getElementById(`${side}${id}`).addEventListener('input', () => UI.updateTriangleResult(id));
            });
        });
    },

    updateTriangleResult: (id) => {
        const x = parseFloat(document.getElementById(`x${id}`).value) || 0;
        const y = parseFloat(document.getElementById(`y${id}`).value) || 0;
        const z = parseFloat(document.getElementById(`z${id}`).value) || 0;

        const area = CalculationService.calculateTriangleArea(x, y, z);
        document.getElementById(`res${id}`).innerText = `المساحة: ${area.toFixed(2)} م²`;

        UI.updateSketch();
    },

    updateSketch: () => {
        const t1 = {
            x: parseFloat(document.getElementById('x1').value) || 0,
            y: parseFloat(document.getElementById('y1').value) || 0,
            z: parseFloat(document.getElementById('z1').value) || 0
        };
        const t2 = {
            x: parseFloat(document.getElementById('x2').value) || 0,
            y: parseFloat(document.getElementById('y2').value) || 0,
            z: parseFloat(document.getElementById('z2').value) || 0
        };
        DrawService.drawLand('landCanvas', t1, t2);
    },

    handleCalculate: () => {
        const x1 = parseFloat(document.getElementById('x1').value) || 0;
        const y1 = parseFloat(document.getElementById('y1').value) || 0;
        const z1 = parseFloat(document.getElementById('z1').value) || 0;

        const x2 = parseFloat(document.getElementById('x2').value) || 0;
        const y2 = parseFloat(document.getElementById('y2').value) || 0;
        const z2 = parseFloat(document.getElementById('z2').value) || 0;

        const area1 = CalculationService.calculateTriangleArea(x1, y1, z1);
        const area2 = CalculationService.calculateTriangleArea(x2, y2, z2);
        const total = area1 + area2;

        // Animate total value
        UI.animateValue('totalValue', 0, total, 1000);

        if (total > 0) {
            CalculationService.saveRecord({
                total: total,
                details: `مثلث 1 (${area1.toFixed(1)}) + مثلث 2 (${area2.toFixed(1)})`
            });
            UI.renderHistory();
        }
    },

    animateValue: (id, start, end, duration) => {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(2);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    renderHistory: () => {
        const history = CalculationService.getHistory();
        const container = document.getElementById('historyList');

        if (history.length === 0) {
            container.innerHTML = '<p class="empty-msg">لا توجد حسابات سابقة</p>';
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item">
                <span class="date">${item.date}</span>
                <div class="val">${item.total} م²</div>
                <small style="color: var(--text-muted); font-size: 0.7rem">${item.details}</small>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', UI.init);
