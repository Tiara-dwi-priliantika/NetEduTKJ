/**
 * PROJECT MPI - Script Utama (Terintegrasi & Diperbarui)
 * Mengatur inisialisasi ikon, animasi UI, sistem halaman materi,
 * serta sistem kuis interaktif dengan koreksi instan dan validasi.
 */

// Variabel Global untuk Manajemen Halaman Materi
let currentPage = 1;
const totalPages = 3; // Sesuai jumlah halaman materi baru kamu

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. INISIALISASI IKON LUCIDE
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 2. DETEKSI HALAMAN AKTIF PADA NAVBAR
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split("/").pop();
    
    if (currentPath !== "") {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    // Logging sederhana saat menu navigasi diklik
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log(`Navigasi ke: ${link.getAttribute('href')}`);
        });
    });

    // ==========================================
    // 3. ANIMASI MUNCUL SAAT SCROLL (REVEAL CARD)
    // ==========================================
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Menerapkan animasi pada elemen berkelas '.card' (di halaman index)
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ==========================================
// 4. LOGIKA SLIDE / PAGINATION MATERI
// ==========================================

/**
 * Fungsi untuk berpindah ke nomor halaman tertentu
 * @param {number} pageNumber - Nomor halaman tujuan (1, 2, atau 3)
 */
function changePage(pageNumber) {
    currentPage = pageNumber;
    
    // A. Update Tampilan Halaman Materi (Slide)
    document.querySelectorAll('.materi-page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // B. Update Tampilan Aktif pada Tombol Angka
    const buttons = document.querySelectorAll('.pagination .page-btn');
    buttons.forEach((btn, index) => {
        if (!btn.classList.contains('next')) {
            btn.classList.remove('active');
            if (index + 1 === pageNumber) {
                btn.classList.add('active');
            }
        }
    });
}

/**
 * Fungsi untuk tombol panah kanan (Next Page)
 */
function nextPage() {
    if (currentPage < totalPages) {
        changePage(currentPage + 1);
    } else {
        changePage(1);
    }
}

function openTab(evt, tabId) {
    // A. Sembunyikan semua konten penjelasan teks terlebih dahulu
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.classList.remove("active");
    });

    // B. Hilangkan status kelas 'active' dari semua tombol menu sidebar kiri
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    // C. Tampilkan isi konten penjelasan teks yang id-nya sesuai dengan yang diklik
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add("active");
    }

    // D. Berikan tanda kelas 'active' pada tombol menu yang baru saja diklik
    evt.currentTarget.classList.add("active");
}


/* ==========================================================================
   LOGIKA SISTEM QUIZ INTERAKTIF DENGAN KOREKSI LANGSUNG & VALIDASI (25 SOAL)
   ========================================================================== */

// 1. Data Bank Soal Lengkap dengan Atribut Penjelasan (Explanation)
const bankSoalTKJ = [
    {
        id: 1,
        question: "Perangkat jaringan yang berfungsi untuk menghubungkan beberapa jaringan yang berbeda segmen IP atau arsitektur serta menentukan jalur terbaik untuk pengiriman data disebut...",
        options: ["Router", "Switch", "Hub", "Access Point"],
        answer: 0,
        explanation: "Router bekerja pada OSI Layer 3 (Network) dan fungsi utamanya adalah merutekan data antar jaringan yang berbeda subnet/IP serta mencari jalur pengiriman terbaik."
    },
    {
        id: 2,
        question: "Perangkat jaringan yang berfungsi untuk menghubungkan banyak perangkat dalam satu jaringan lokal (LAN) secara pintar dengan mengenali MAC Address tujuan adalah...",
        options: ["Router", "Switch", "Modem", "Repeater"],
        answer: 1,
        explanation: "Switch bekerja secara pintar di OSI Layer 2. Switch mencatat tabel MAC Address perangkat yang terhubung sehingga data dikirim langsung ke port komputer tujuan tanpa broadcast masal."
    },
    {
        id: 3,
        question: "Apa perbedaan mendasar antara perangkat Switch dan Hub di dalam jaringan LAN?",
        options: ["Switch membagi sinyal internet, Hub menerima sinyal", "Switch menyalurkan data secara broadcast ke semua port, Hub menyaring MAC Address", "Switch bekerja pintar menyalurkan paket data hanya ke port tujuan, Hub mengirim data ke semua port", "Hub menggunakan media optik, Switch tembaga"],
        answer: 2,
        explanation: "Hub bersifat pasif/kurang pintar karena menyebarkan data ke semua port (broadcast) yang memicu tabrakan data (collision). Sedangkan Switch menyalurkan data spesifik ke port tujuan saja."
    },
    {
        id: 4,
        question: "Perangkat yang bertindak memancarkan sinyal radio nirkabel agar perangkat user bisa terhubung ke jaringan tanpa menggunakan kabel fisik adalah...",
        options: ["Access Point", "NIC Card", "Bridge", "Firewall"],
        answer: 0,
        explanation: "Access Point (AP) bertindak sebagai transceiver nirkabel yang memancarkan sinyal Wi-Fi untuk menghubungkan klien tanpa kabel ke jaringan lokal utama."
    },
    {
        id: 5,
        question: "Perangkat yang berfungsi mengubah sinyal analog dari penyedia layanan (ISP) menjadi sinyal digital agar dimengerti komputer, atau sebaliknya adalah...",
        options: ["Repeater", "Modem", "Hub", "Router"],
        answer: 1,
        explanation: "Modem singkatan dari Modulator Demodulator. Fungsinya melakukan modulasi (mengubah digital ke analog) dan demodulasi (mengubah analog ke digital) dari jalur ISP."
    },
    {
        id: 6,
        question: "Jika sinyal jaringan Wi-Fi di lantai dua sekolah terasa sangat lemah, perangkat fungsional apa yang paling tepat dipasang untuk menguatkan pancaran sinyal tersebut?",
        options: ["Firewall", "NIC", "Repeater", "Bridge"],
        answer: 2,
        explanation: "Repeater bertugas menerima sinyal radio Wi-Fi yang sudah lemah, lalu memancarkannya kembali dengan kekuatan penuh tanpa mengubah struktur data."
    },
    {
        id: 7,
        question: "Perangkat jaringan yang membagi atau memecah satu jaringan besar menjadi dua buah segmen jaringan lokal yang lebih kecil berdasarkan konfigurasi tertentu disebut...",
        options: ["Bridge", "Hub", "Modem", "Kabel UTP"],
        answer: 0,
        explanation: "Bridge digunakan untuk membagi jaringan besar atau menghubungkan dua jenis topologi jaringan lokal yang berbeda segmen agar manajemen lalu lintasnya lebih efisien."
    },
    {
        id: 8,
        question: "Komponen perangkat keras yang wajib terpasang langsung secara fisik pada motherboard komputer agar komputer tersebut dapat dicolokkan kabel LAN dinamakan...",
        options: ["Access Point", "NIC (Network Interface Card)", "Firewall Hardware", "Switch Muted"],
        answer: 1,
        explanation: "NIC (Network Interface Card) atau sering disebut LAN Card adalah kartu antarmuka fisik jaringan yang memberikan alamat MAC unik bagi komputer untuk berkomunikasi lewat kabel LAN."
    },
    {
        id: 9,
        question: "Apakah kepanjangan dari istilah media transmisi kabel UTP?",
        options: ["Universal Twisted Packet", "Uniform Thermal Protect", "Unshielded Twisted Pair", "Union Transmission Port"],
        answer: 2,
        explanation: "UTP stands for Unshielded Twisted Pair. Artinya kabel berpasangan yang dililit berpilin tanpa lapisan pelindung foil pembungkus internal."
    },
    {
        id: 10,
        question: "Kabel jaringan yang dilapisi pelindung tambahan berupa aluminium foil di dalam jaket luarnya untuk memblokir interferensi elektromagnetik tingkat tinggi adalah...",
        options: ["Kabel UTP", "Kabel Serat Plastik", "Kabel STP", "Kabel Coaxial Biasa"],
        answer: 2,
        explanation: "STP (Shielded Twisted Pair) menggunakan pelindung pembungkus berupa foil logam tipis untuk mengisolasi konduktor tembaga dari gangguan interferensi magnetik luar."
    },
    {
        id: 11,
        question: "Media transmisi yang memanfaatkan berkas pulsa sinar cahaya melalui media kaca tipis berkecepatan tinggi dan kebal terhadap petir dinamakan...",
        options: ["Fiber Optic", "Kabel UTP Cat6", "Kabel STP Outdoor", "Kabel Telephone"],
        answer: 0,
        explanation: "Fiber Optic mentransmisikan data digital menggunakan modulasi cahaya melalui serat silika/kaca. Karena tidak mengalirkan listrik, kabel ini 100% kebal petir dan korosi."
    },
    {
        id: 12,
        question: "Sistem keamanan jaringan yang bertindak memantau, menyaring, dan mengontrol lalu lintas data ilegal yang masuk atau keluar dari jaringan internal komputer sekolah disebut...",
        options: ["Router", "Bridge", "Firewall", "Modem Layer"],
        answer: 2,
        explanation: "Firewall adalah dinding pertahanan keamanan sistem yang menganalisis paket data masuk/keluar berdasarkan aturan privasi (security rules) untuk mencegah peretasan."
    },
    {
        id: 13,
        question: "Berapakah batas panjang jarak maksimal penarikan kabel UTP standar tanpa bantuan alat penguat sinyal?",
        options: ["50 Meter", "100 Meter", "500 Meter", "1 Kilometer"],
        answer: 1,
        explanation: "Sesuai standar internasional Ethernet TIA/EIA, panjang kabel UTP maksimal per segmen tanpa perangkat aktif (seperti switch/repeater) adalah 100 meter agar sinyal tidak drop."
    },
    {
        id: 14,
        question: "Konektor standar internasional yang digunakan untuk dipasang pada ujung kabel jaringan UTP atau STP bernama...",
        options: ["RJ45", "Konektor SC", "Konektor BNC", "Port USB-C"],
        answer: 0,
        explanation: "Konektor RJ45 (Registered Jack 45) adalah konektor fisik standar dengan 8 pin kaki tembaga yang dipasangkan pada kabel jaringan LAN berbasis Twisted Pair."
    },
    {
        id: 15,
        question: "Tipe kabel Fiber Optic yang memiliki ukuran inti kaca sangat kecil dan dikhususkan untuk transmisi jarak sangat jauh mencapai puluhan kilometer adalah...",
        options: ["Multi-mode", "Single-mode", "Twisted-mode", "Unshielded-mode"],
        answer: 1,
        explanation: "Single-mode Fiber (SMF) memiliki core kaca kecil sekitar 9 mikron, yang memancarkan satu sinar laser tunggal searah lurus, sehingga degradasi sinyal kecil dan mampu menjangkau jarak puluhan KM."
    },
    {
        id: 16,
        question: "Di bawah ini yang merupakan standar urutan pewarnaan kabel internasional untuk jaringan komputer yaitu...",
        options: ["TIA/EIA-568A dan 568B", "OSI Layer 1 dan 2", "IEEE 802.11a/b", "ISO 9001 Jaringan"],
        answer: 0,
        explanation: "Standar industri pengabelan komersial internasional yang mengatur urutan 8 warna pin kabel LAN dibuat oleh asosiasi TIA/EIA seri standar 568A dan 568B."
    },
    {
        id: 17,
        question: "Router bekerja melayani perutean data pada model arsitektur referensi OSI di layer berapakah?",
        options: ["Layer 1 (Physical)", "Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)"],
        answer: 2,
        explanation: "Router membaca informasi IP address asal dan tujuan paket data, di mana pemrosesan logika IP address ini berada pada OSI Layer 3 (Network Layer)."
    },
    {
        id: 18,
        question: "Teknologi pengabelan serat optik yang langsung ditarik masuk ke dalam rumah-rumah konsumen internet dikenal dengan istilah...",
        options: ["FTTH (Fiber to the Home)", "LAN Cable Home", "Wireless Local Loop", "Broadband Cable Link"],
        answer: 0,
        explanation: "FTTH (Fiber to the Home) adalah arsitektur jaringan distribusi serat optik yang ditarik dari pusat provider langsung sampai ke dalam rumah pelanggan."
    },
    {
        id: 19,
        question: "Firewall yang bekerja dasar menyaring header paket data (IP Asal, IP Tujuan, dan Port) secara mendasar disebut...",
        options: ["Packet Filtering", "Stateful Inspection", "Next-Gen Firewall", "Application Layer Proxy"],
        answer: 0,
        explanation: "Packet Filtering adalah generasi awal firewall yang bertugas memeriksa header paket dasar tanpa membedakan status state atau isi payload aplikasi."
    },
    {
        id: 20,
        question: "Konektor berikut yang biasa dipasang untuk keperluan penyambungan kabel Fiber Optic adalah...",
        options: ["RJ45 Metal", "SC atau LC", "RJ11", "Konektor T-Coaxial"],
        answer: 1,
        explanation: "SC (Subscriber Connector) dan LC (Lucent Connector) merupakan tipe konektor mekanis serat optik yang paling populer dipakai pada port switch SFP atau media converter."
    },
    {
        id: 21,
        question: "Alat bantu khusus yang digunakan untuk memasang dan mengunci konektor RJ45 pada kabel UTP dinamakan...",
        options: ["Tang Crimping", "Splicer Optic", "Obeng Plus", "Stripper Wire"],
        answer: 0,
        explanation: "Tang Crimping (Crimping Tool) adalah alat utama untuk memotong, mengupas, dan menjepit/menekan pin tembaga konektor RJ45 ke inti kabel LAN agar terpasang kuat."
    },
    {
        id: 22,
        question: "Mengapa kabel UTP kurang cocok jika dipasang untuk kebutuhan instalasi antar-tower luar ruangan (outdoor)?",
        options: ["Karena harganya terlalu mahal", "Tidak memiliki pelindung foil sehingga rentan rusak akibat cuaca ekstrem dan interferensi gelombang udara luar", "Kabel terlalu kaku untuk ditarik", "Tidak mendukung konektor RJ45"],
        answer: 1,
        explanation: "Kabel UTP tidak dibekali foil shield pelindung statis. Jika dipasang outdoor, kabel akan cepat rusak terkena panas-hujan serta rentan terkena imbas induksi petir dan desibel radio frekuensi udara luar."
    },
    {
        id: 23,
        question: "Perangkat jaringan Switch beroperasi dominan pada model referensi OSI Layer...",
        options: ["Layer 1 (Physical)", "Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 7 (Application)"],
        answer: 1,
        explanation: "Switch standar (Layer 2 Switch) memproses penyaringan data berdasarkan MAC address perangkat hardware, yang mana protokol ini berjalan di OSI Layer 2 (Data Link Layer)."
    },
    {
        id: 24,
        question: "Fungsi firewall di sekolah yang digunakan untuk memblokir situs web negatif atau game online saat jam pelajaran berlangsung termasuk fitur...",
        options: ["Content Filtering", "Packet Sniffing", "NAT Routing", "DHCP Server Control"],
        answer: 0,
        explanation: "Content Filtering (Pemfilteran Konten) adalah fitur firewall/proxy untuk menganalisis isi URL alamat web dan memblokir kata kunci tertentu agar tidak bisa diakses pengguna."
    },
    {
        id: 25,
        question: "Fitur pada Router yang mengonfigurasi pembagian alamat IP otomatis ke seluruh komputer client yang terhubung disebut...",
        options: ["DHCP Server", "Firewall Filter", "Bridging Port", "Signal Repeater"],
        answer: 0,
        explanation: "DHCP (Dynamic Host Configuration Protocol) Server adalah layanan router yang bertugas mendistribusikan konfigurasi IP Address, Gateway, dan DNS ke klien secara otomatis saat tersambung."
    }
];

// 2. State Variabel Kuis
let indeksSoalSekarang = 0;
let jawabanUser = Array(bankSoalTKJ.length).fill(null);

// 3. Fungsi Memulai Kuis
function startQuiz() {
    document.getElementById('quiz-start-view').style.display = 'none';
    document.getElementById('quiz-play-view').style.display = 'block';
    document.getElementById('quiz-breadcrumb-global').style.display = 'none';
    indeksSoalSekarang = 0;
    jawabanUser = Array(bankSoalTKJ.length).fill(null);
    tampilkanSoal();
}

// 4. Fungsi Menampilkan Soal Aktif ke Layar
function tampilkanSoal() {
    const dataSoal = bankSoalTKJ[indeksSoalSekarang];
    
    // Update Teks Progress & Progress Bar
    document.getElementById('quiz-current-status').innerText = `Soal ${indeksSoalSekarang + 1} dari ${bankSoalTKJ.length}`;
    const persenProgress = ((indeksSoalSekarang + 1) / bankSoalTKJ.length) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${persenProgress}%`;
    
    // Set Teks Pertanyaan
    document.getElementById('question-text').innerText = dataSoal.question;
    
    // Sembunyikan Box Penjelasan Realtime Terlebih Dahulu
    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) {
        feedbackBox.style.display = 'none';
    }
    
    // Render Pilihan Jawaban
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const labelAbjad = ['A', 'B', 'C', 'D'];
    const sudahDijawab = (jawabanUser[indeksSoalSekarang] !== null);
    
    dataSoal.options.forEach((opsi, indeksOpsi) => {
        const itemOpsi = document.createElement('div');
        itemOpsi.className = 'option-item';
        
        // Atur Style Warna secara Realtime jika Soal Sudah Dijawab
        if (sudahDijawab) {
            if (indeksOpsi === dataSoal.answer) {
                // Jawaban yang Benar otomatis Hijau
                itemOpsi.classList.add('correct-answer-style');
            } else if (jawabanUser[indeksSoalSekarang] === indeksOpsi) {
                // Pilihan User salah otomatis Merah
                itemOpsi.classList.add('wrong-answer-style');
            }
        } else {
            // Jika belum dijawab, pasang fungsi klik pilih jawaban
            itemOpsi.onclick = () => pilihJawaban(indeksOpsi);
        }
        
        // Buat radio button input
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'opsi-kuis';
        radioInput.className = 'option-radio';
        radioInput.checked = (jawabanUser[indeksSoalSekarang] === indeksOpsi);
        radioInput.disabled = sudahDijawab; // Kunci input jika sudah terjawab
        
        const labelTeks = document.createElement('span');
        labelTeks.innerText = `${labelAbjad[indeksOpsi]}. ${opsi}`;
        
        itemOpsi.appendChild(radioInput);
        itemOpsi.appendChild(labelTeks);
        optionsContainer.appendChild(itemOpsi);
    });
    
    // Pengaturan Validasi Keaktifan Tombol Navigasi Bawah
    document.getElementById('btn-prev-question').disabled = (indeksSoalSekarang === 0);
    
    const btnNext = document.getElementById('btn-next-question');
    btnNext.disabled = !sudahDijawab; // Kunci tombol selanjutnya jika belum diisi
    
    if (indeksSoalSekarang === bankSoalTKJ.length - 1) {
        btnNext.innerText = 'Selesai & Hitung Skor';
    } else {
        btnNext.innerText = 'Selanjutnya';
    }

    // Tampilkan Box Penjelasan jika user membuka kembali soal yang sudah pernah diisi
    if (sudahDijawab) {
        tampilkanPenjelasanMateri(dataSoal);
    }
}

// 5. Fungsi saat Opsi Jawaban Diklik (Koreksi Instan)
function pilihJawaban(indeksOpsi) {
    jawabanUser[indeksSoalSekarang] = indeksOpsi;
    tampilkanSoal(); // Re-render untuk memproses penambahan kelas warna dan membuka tombol selanjutnya
}

// 6. Fungsi Membuka Box Penjelasan Materi
function tampilkanPenjelasanMateri(dataSoal) {
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const statusTitle = document.getElementById('feedback-status-title');
    const explanationText = document.getElementById('feedback-explanation-text');
    
    if (!feedbackBox || !statusTitle || !explanationText) return;

    const userBenar = (jawabanUser[indeksSoalSekarang] === dataSoal.answer);
    
    if (userBenar) {
        statusTitle.innerText = "✓ Jawaban Kamu Benar!";
        feedbackBox.className = "feedback-box correct-box";
    } else {
        statusTitle.innerText = "✗ Jawaban Kamu Salah!";
        feedbackBox.className = "feedback-box wrong-box";
    }
    
    explanationText.innerText = dataSoal.explanation;
    feedbackBox.style.display = 'block';
}

// 7. Fungsi Tombol Sebelumnya
function prevQuestion() {
    if (indeksSoalSekarang > 0) {
        indeksSoalSekarang--;
        tampilkanSoal();
    }
}

// 8. Fungsi Tombol Selanjutnya / Selesai
function nextQuestion() {
    if (indeksSoalSekarang < bankSoalTKJ.length - 1) {
        indeksSoalSekarang++;
        tampilkanSoal();
    } else {
        hitungSkorAkhir();
    }
}

// 9. Fungsi Kalkulasi Skor Akhir
function hitungSkorAkhir() {
    let jawabanBenar = 0;
    
    bankSoalTKJ.forEach((soal, indeks) => {
        if (jawabanUser[indeks] === soal.answer) {
            jawabanBenar++;
        }
    });
    
    const nilaiFinal = Math.round((jawabanBenar / bankSoalTKJ.length) * 100);
    document.getElementById('final-score-display').innerText = `${nilaiFinal} / 100`;
    
    const teksFeedback = document.getElementById('score-feedback');
    if (nilaiFinal >= 80) {
        teksFeedback.innerText = "Luar biasa! Pemahaman materi jaringan kamu sangat matang.";
    } else if (nilaiFinal >= 60) {
        teksFeedback.innerText = "Bagus! Terus tingkatkan pemahamanmu agar lebih maksimal.";
    } else {
        teksFeedback.innerText = "Jangan menyerah! Coba baca kembali materi dan ulangi kuis.";
    }
    
    document.getElementById('quiz-play-view').style.display = 'none';
    document.getElementById('quiz-score-view').style.display = 'block';
    
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
}

// 10. Ulangi Kuis
function resetAndRestartQuiz() {
    document.getElementById('quiz-score-view').style.display = 'none';
    startQuiz();
}

// 11. Selesai (Halaman Terima Kasih)
function showThankYouPage() {
    document.getElementById('quiz-score-view').style.display = 'none';
    document.getElementById('quiz-thanks-view').style.display = 'block';
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
}