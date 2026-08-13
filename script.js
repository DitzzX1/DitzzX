const updateScrollGlow = () => {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;

    document.body.style.setProperty("--scroll-y", `${scrollPercent}%`);
};

window.addEventListener("scroll", updateScrollGlow, { passive: true });
window.addEventListener("resize", updateScrollGlow);
updateScrollGlow();

const documentationTopics = {
    proyek: { label: "Proyek", title: "Dokumentasi Proyek", intro: "Kumpulan proses pengerjaan, hasil, dan catatan dari setiap proyek." },
    kegiatan: { label: "Kegiatan Sekolah", title: "Dokumentasi Kegiatan Sekolah", intro: "Catatan kegiatan sekolah, kelas, dan organisasi yang diikuti." },
    praktik: { label: "Praktik", title: "Dokumentasi Praktik", intro: "Kumpulan hasil serta proses praktik Teknik Grafika." },
    prestasi: { label: "Prestasi & Pelatihan", title: "Dokumentasi Prestasi & Pelatihan", intro: "Sertifikat, pelatihan, dan pencapaian yang telah diperoleh." },
};

const selectedTopic = new URLSearchParams(window.location.search).get("topik");
const topicContent = documentationTopics[selectedTopic];

if (topicContent) {
    document.title = `${topicContent.title} — Aditya Krisma Wardhana`;
    document.querySelector("#detail-label")?.replaceChildren(topicContent.label);
    document.querySelector("#detail-title")?.replaceChildren(topicContent.title);
    document.querySelector("#detail-intro")?.replaceChildren(topicContent.intro);
}

const canvas = document.querySelector("#background-nodes");

if (canvas) {
    const context = canvas.getContext("2d");
    const nodes = [];
    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodeCount = () => Math.min(70, Math.max(28, Math.floor(window.innerWidth / 24)));
    const connectionDistance = 145;

    const createNode = () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        radius: Math.random() * 1.5 + 0.8,
    });

    const resizeCanvas = () => {
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        context.setTransform(scale, 0, 0, scale, 0, 0);

        nodes.length = 0;
        Array.from({ length: nodeCount() }, createNode).forEach((node) => nodes.push(node));
    };

    const drawNodes = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        nodes.forEach((node, index) => {
            if (!motionReduced) {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
                if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
            }

            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fillStyle = "rgba(255, 141, 240, 0.48)";
            context.fill();

            for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
                const other = nodes[otherIndex];
                const distance = Math.hypot(node.x - other.x, node.y - other.y);

                if (distance < connectionDistance) {
                    context.beginPath();
                    context.moveTo(node.x, node.y);
                    context.lineTo(other.x, other.y);
                    context.strokeStyle = `rgba(141, 183, 255, ${0.16 * (1 - distance / connectionDistance)})`;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }
        });

        if (!motionReduced) requestAnimationFrame(drawNodes);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawNodes();
}
