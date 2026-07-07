import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { useAppearance } from '@/hooks/use-appearance';
import { cn, toAsset } from '@/lib/utils';
import { useState, useMemo } from 'react';
import {
    Search,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Clock,
    Database,
    UserCheck,
    HelpCircle,
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    Menu,
    X,
    Sun,
    Moon,
    Monitor,
    Laptop,
    Network,
    BookOpen,
    Key,
    Info,
    RefreshCw,
    Send,
    ArrowRight,
    ChevronDown,
    Building2,
    MessageSquare,
    AlertTriangle,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

// Define Interface for mock articles
interface Article {
    id: string;
    title: string;
    category: 'jaringan' | 'aplikasi' | 'hardware' | 'data';
    summary: string;
    content: string;
}

// Define Interface for Mock Ticket
interface MockTicket {
    id: string;
    title: string;
    type: 'support' | 'technical';
    status: 'OPEN' | 'ON PROGRESS' | 'DONE';
    reporter: string;
    agent: string;
    date: string;
    description: string;
    updates: string[];
}

export default function Welcome() {
    const { auth } = usePage().props;
    const { appearance, updateAppearance } = useAppearance();

    // Responsive Mobile Menu State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Interactive Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // FAQ Tab & Accordion States
    const [activeFaqTab, setActiveFaqTab] = useState<'all' | 'jaringan' | 'aplikasi' | 'hardware'>('all');
    const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

    // Ticket Lookup States
    const [lookupTicketId, setLookupTicketId] = useState('');
    const [searchedTicket, setSearchedTicket] = useState<MockTicket | null>(null);
    const [lookupExecuted, setLookupExecuted] = useState(false);

    // Mock Help Center Articles Data
    const mockArticles: Article[] = [
        {
            id: 'art-1',
            title: 'Cara Menghubungkan Wifi Damkar Pos',
            category: 'jaringan',
            summary: 'Langkah menghubungkan perangkat Anda ke jaringan SSID DAMKAR_POS.',
            content: 'Setiap pos pemadam dilengkapi SSID jaringan internal DAMKAR_POS. Untuk menyambung: (1) Aktifkan Wifi pada perangkat Anda, (2) Pilih SSID DAMKAR_POS, (3) Masukkan kredensial Akun Jasinfo Anda (username tanpa akhiran domain, dan password standar Anda), (4) Jika diminta sertifikat CA, pilih "Jangan Validasi" atau "No Validation". Hubungi tim Jasinfo di Pos atau Sudin jika akses tetap tertolak.'
        },
        {
            id: 'art-2',
            title: 'Solusi Error Kredensial Tidak Valid E-Satgas',
            category: 'aplikasi',
            summary: 'Troubleshooting kegagalan login di aplikasi absensi & tugas E-Satgas.',
            content: 'Jika Anda menemui error "Kredensial Tidak Valid" saat login E-Satgas: (1) Pastikan Anda tidak menggunakan spasi di akhir username, (2) Lakukan sinkronisasi akun dengan login ulang terlebih dahulu di portal utama Helpdesk Jasinfo, (3) Hapus cache aplikasi E-Satgas di pengaturan ponsel Anda, (4) Jika masih bermasalah, gunakan fitur Reset Password di Portal Jasinfo atau hubungi admin bidang informasi.'
        },
        {
            id: 'art-3',
            title: 'Prosedur Pengajuan Reset Password SIAGA API',
            category: 'aplikasi',
            summary: 'Panduan memulihkan akun pengembang atau token akses SIAGA API.',
            content: 'Untuk alasan keamanan, perubahan token/password SIAGA API harus melalui validasi. Anda dapat mengajukan permohonan dengan masuk ke Dashboard IT Helpdesk, pilih menu "Profil & Keamanan", klik "Kelola API Token", lalu klik "Minta Token Baru". Admin Jasinfo akan memvalidasi permohonan Anda dalam 5-15 menit.'
        },
        {
            id: 'art-4',
            title: 'Panduan Instalasi Printer & CCTV Pos Baru',
            category: 'hardware',
            summary: 'Petunjuk konfigurasi IP printer jaringan dan integrasi CCTV Pos Damkar.',
            content: 'Setiap printer baru di pos damkar menggunakan alamat IP statis dalam subnet pos Anda (biasanya .50 atau .51). Konfigurasikan port TCP/IP di komputer Anda mengarah ke IP tersebut. Untuk CCTV, hubungkan kabel LAN ke switch pos bertanda tag "CCTV-Jasinfo", IP address kamera akan didistribusikan otomatis via DHCP, kemudian daftarkan Mac Address kamera ke admin Command Center untuk dipetakan ke layar monitor utama.'
        },
        {
            id: 'art-5',
            title: 'Pengajuan Permintaan Ekstraksi Data Laporan',
            category: 'data',
            summary: 'Prosedur meminta rekapitulasi data penyelamatan/pemadaman damkar.',
            content: 'Permintaan data untuk keperluan dinas eksternal atau laporan pos/sudin dapat diajukan dengan membuat tiket baru tipe "Permintaan Layanan Data" di Dashboard. Lampirkan dokumen surat permohonan resmi dari unit pengaju. Data rekapitulasi berupa file Excel/CSV akan dikirimkan langsung ke email dinas Anda paling lambat 1 hari kerja setelah disetujui Kepala Bidang Jasinfo.'
        }
    ];

    // Mock FAQs Data
    const faqs = [
        {
            id: 1,
            category: 'jaringan',
            question: 'Bagaimana cara menyambungkan internet Pos Damkar yang terputus?',
            answer: 'Pertama, periksa lampu indikator pada Router/Modem utama di Pos Anda. Jika lampu PON berkedip merah atau lampu internet mati, silakan restart modem dengan mencabut adaptor selama 10 detik lalu pasang kembali. Jika tetap mati setelah 5 menit, buat tiket Technical Support di portal ini dengan menyertakan foto modem.'
        },
        {
            id: 2,
            category: 'aplikasi',
            question: 'Bagaimana cara mendaftarkan akun IT Helpdesk baru?',
            answer: 'Setiap petugas aktif Damkar DKI Jakarta (PNS maupun PJLP) dapat mendaftar mandiri. Klik tombol "Register" di pojok kanan atas, masukkan NIP atau NIK PJLP Anda yang valid, masukkan email dinas/pribadi aktif, dan tentukan password Anda. Akun Anda akan aktif seketika dan dapat digunakan untuk melaporkan kendala.'
        },
        {
            id: 3,
            category: 'hardware',
            question: 'Bagaimana melaporkan kerusakan komputer atau printer di Pos?',
            answer: 'Masuk ke akun Helpdesk Anda, pilih "Buat Tiket Baru", lalu pilih kategori "Bantuan Teknis / Technical Support". Isi detail perangkat yang bermasalah (merek, tipe) serta keluhan yang dialami. Unggah foto kerusakan jika ada untuk mempercepat proses identifikasi oleh teknisi Jasinfo.'
        },
        {
            id: 4,
            category: 'jaringan',
            question: 'Apakah tamu/instansi luar boleh menggunakan Wifi internal pos?',
            answer: 'Jaringan Wifi DAMKAR_POS dikhususkan untuk operasional petugas damkar DKI Jakarta. Tamu/instansi luar dilarang menggunakan wifi operasional demi menjaga keamanan data taktis penyelamatan. Silakan gunakan jaringan hotspot publik jika tersedia di pos.'
        },
        {
            id: 5,
            category: 'aplikasi',
            question: 'Siapa yang bisa dihubungi saat darurat sistem IT lumpuh?',
            answer: 'Jika terjadi kendala kritis berskala luas (misalnya seluruh sistem absensi atau sistem dispatch Damkar One mati), Anda dapat menghubungi tim Jasinfo secara langsung melalui ekstensi 202 di telepon CC Damkar atau hubungi Hotline WhatsApp di +62 85119 995 113.'
        }
    ];

    // Mock Ticket Database for quick lookup
    const mockTicketsDb: Record<string, MockTicket> = {
        'TKT-202607-0001': {
            id: 'TKT-202607-0001',
            title: 'Absensi E-Satgas Tidak Sinkron',
            type: 'support',
            status: 'DONE',
            reporter: 'Seksi Operasi Jakarta Barat',
            agent: 'Rizvan (Jasinfo)',
            date: '2026-07-01',
            description: 'Data absensi shift malam tgl 30 Juni di Pos Cengkareng tidak terkirim ke server pusat.',
            updates: [
                'Laporan kendala diterima oleh Bidang Jasinfo (08:30 WIB)',
                'Dilakukan analisis konektivitas server database E-Satgas (09:15 WIB)',
                'Sync manual dijalankan, data absensi 42 personel berhasil ditarik (10:00 WIB)',
                'Masalah selesai. Tiket ditutup oleh Agen.'
            ]
        },
        'TKT-202607-0002': {
            id: 'TKT-202607-0002',
            title: 'Wifi Pos Damkar Salemba Mati',
            type: 'technical',
            status: 'ON PROGRESS',
            reporter: 'Kasi Sektor Johar Baru',
            agent: 'Mulyana (Jasinfo)',
            date: '2026-07-03',
            description: 'Indikator internet modem Huawei di pos berkedip merah sejak kemarin malam. Petugas tidak bisa input laporan harian.',
            updates: [
                'Laporan kerusakan jaringan didaftarkan (10:15 WIB)',
                'Koordinasi dengan pihak provider ISP untuk pengecekan jaringan luar (11:30 WIB)',
                'Teknisi Jasinfo ditugaskan menuju Pos Salemba membawa router cadangan (14:00 WIB)'
            ]
        },
        'TKT-202607-0003': {
            id: 'TKT-202607-0003',
            title: 'Permintaan Data Pemadaman Bulan Juni',
            type: 'support',
            status: 'OPEN',
            reporter: 'Sekretariat Dinas',
            agent: 'Menunggu Penugasan',
            date: '2026-07-06',
            description: 'Ekstraksi data rekapitulasi jumlah kejadian kebakaran dan penyelamatan penyelamatan di 5 wilayah kota bulan Juni 2026.',
            updates: [
                'Tiket masuk dan mengantri di sistem Jasinfo (14:30 WIB)',
                'Menunggu persetujuan Kepala Bidang Jasinfo untuk proses query data.'
            ]
        }
    };

    // Real-time suggestions search logic
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return mockArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // FAQ tab filter logic
    const filteredFaqs = useMemo(() => {
        if (activeFaqTab === 'all') return faqs;
        return faqs.filter(faq => faq.category === activeFaqTab);
    }, [activeFaqTab]);

    // Handle quick ticket lookup
    const handleTicketLookup = (e: React.FormEvent) => {
        e.preventDefault();
        const tid = lookupTicketId.trim().toUpperCase();
        if (mockTicketsDb[tid]) {
            setSearchedTicket(mockTicketsDb[tid]);
        } else {
            setSearchedTicket(null);
        }
        setLookupExecuted(true);
    };

    // Reset lookup state
    const resetLookup = () => {
        setLookupTicketId('');
        setSearchedTicket(null);
        setLookupExecuted(false);
    };

    return (
        <>
            <Head title="IT Helpdesk | Jasinfo Disgulkarmat" />
            <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-neutral-100">

                {/* Floating Navbar with Glassmorphism */}
                <header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-md dark:border-neutral-800/60 dark:bg-[#0a0a0a]/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        {/* Logo section */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10 p-1 shadow-inner dark:bg-red-500/20">
                                <img
                                    src={toAsset('/pampi-head.png')}
                                    alt="Pampi Logo"
                                    className="h-9 w-9 object-contain"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-base">
                                    Jasinfo IT Helpdesk
                                </span>
                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                    Disgulkarmat Provinsi DKI Jakarta
                                </span>
                            </div>
                        </Link>

                        {/* Navigation links - Desktop */}
                        <nav className="hidden items-center gap-6 md:flex">
                            <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">
                                Layanan
                            </a>
                            <a href="#status" className="text-sm font-medium text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">
                                Status Sistem
                            </a>
                            <a href="#faq" className="text-sm font-medium text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">
                                FAQ
                            </a>
                            <a href="#contact" className="text-sm font-medium text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">
                                Kontak
                            </a>
                        </nav>

                        {/* Actions (Login/Register & Dark Mode) */}
                        <div className="hidden items-center gap-3 md:flex">
                            {/* Theme Switcher Button */}
                            <button
                                onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                title="Toggle Theme"
                            >
                                {appearance === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                            </button>

                            {/* Authentication Links */}
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button className="h-9 gap-1.5 bg-red-600 font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white">
                                        Dashboard <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="ghost" className="h-9 font-medium text-neutral-700 dark:text-neutral-300">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button className="h-9 bg-neutral-900 font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                                            Daftar Akun
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Hamburger button for Mobile */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                            >
                                {appearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="border-t border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-[#0a0a0a] md:hidden">
                            <nav className="flex flex-col gap-3">
                                <a
                                    href="#features"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                >
                                    Layanan
                                </a>
                                <a
                                    href="#status"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                >
                                    Status Sistem
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                >
                                    FAQ
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                >
                                    Kontak
                                </a>
                                <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />
                                {auth.user ? (
                                    <Link href={dashboard()} onClick={() => setMobileMenuOpen(false)} className="w-full">
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link href={login()} onClick={() => setMobileMenuOpen(false)} className="w-full">
                                            <Button variant="outline" className="w-full border-neutral-300 dark:border-neutral-700">
                                                Masuk
                                            </Button>
                                        </Link>
                                        <Link href={register()} onClick={() => setMobileMenuOpen(false)} className="w-full">
                                            <Button className="w-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                                                Daftar
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                {/* Hero Section & Glow Layout */}
                <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
                    {/* Glow grids */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                    <div className="absolute top-0 left-1/2 -z-10 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl dark:bg-red-500/5" />

                    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
                        {/* Section Header */}
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/5 px-3 py-1 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                            <Building2 className="h-3.5 w-3.5" /> Bidang Jasinfo Disgulkarmat DKI Jakarta
                        </div>
                        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Portal Layanan Informasi &{' '}
                            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent dark:from-red-500 dark:to-orange-400">
                                Bantuan Teknis IT
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
                            Laporkan kendala aplikasi operasional, gangguan jaringan pos pemadam, perbaikan hardware, atau ajukan permintaan layanan data secara terpadu.
                        </p>

                        {/* Interactive Help Search Bar */}
                        <div className="mx-auto mt-10 max-w-xl">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari solusi kendala (misal: Wifi Pos, E-Satgas)..."
                                    className="block w-full rounded-xl border border-neutral-300 bg-white py-3.5 pr-4 pl-11 text-sm shadow-md transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 dark:border-neutral-800 dark:bg-[#111111] dark:shadow-black/40"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Live Suggestions Dropdown */}
                            {searchQuery && (
                                <div className="absolute mt-2 max-w-xl w-full left-1/2 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white/95 p-2 shadow-lg backdrop-blur-md dark:border-neutral-800 dark:bg-[#161616]/95 z-30 text-left">
                                    <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                                        Hasil Pencarian Dokumen Bantuan
                                    </div>
                                    {filteredArticles.length > 0 ? (
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredArticles.map((article) => (
                                                <button
                                                    key={article.id}
                                                    onClick={() => {
                                                        setSelectedArticle(article);
                                                        setSearchQuery('');
                                                    }}
                                                    className="w-full flex flex-col gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                                                >
                                                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {article.title}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                                        {article.summary}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-4 text-sm text-neutral-500">
                                            <Info className="h-4.5 w-4.5 text-neutral-400" />
                                            Solusi tidak ditemukan. Coba gunakan kata kunci lain.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Hero CTAs */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {auth.user ? (
                                <Link href="/tickets/create">
                                    <Button className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95">
                                        Buat Laporan / Tiket Baru
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95">
                                        Buat Laporan / Tiket Baru
                                    </Button>
                                </Link>
                            )}

                            {/* Sheet Drawer for Ticket Quick-Lookup */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        onClick={resetLookup}
                                        className="h-11 px-6 border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold text-sm rounded-xl shadow-xs dark:border-neutral-800 dark:bg-[#111111] dark:text-neutral-300 dark:hover:bg-neutral-900"
                                    >
                                        Lacak Status Tiket
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-md border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] p-6">
                                    <SheetHeader className="pb-4 border-b border-neutral-150 dark:border-neutral-800">
                                        <SheetTitle className="text-lg font-bold flex items-center gap-2">
                                            <RefreshCw className="h-5 w-5 text-red-500 animate-spin-slow" /> Lacak Status Laporan
                                        </SheetTitle>
                                        <SheetDescription className="text-xs text-neutral-500">
                                            Periksa progres tiket bantuan Anda secara real-time dengan nomor tiket.
                                        </SheetDescription>
                                    </SheetHeader>

                                    {/* Lookup Form */}
                                    <form onSubmit={handleTicketLookup} className="mt-6 flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="ticket-id" className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                                Nomor Tiket (ID Laporan)
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="ticket-id"
                                                    value={lookupTicketId}
                                                    onChange={(e) => setLookupTicketId(e.target.value)}
                                                    placeholder="Contoh: TKT-202607-0001"
                                                    required
                                                    className="uppercase dark:bg-neutral-900"
                                                />
                                                <Button type="submit" className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold">
                                                    Cari
                                                </Button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Lookup Results */}
                                    <div className="mt-8">
                                        {lookupExecuted && searchedTicket ? (
                                            <div className="flex flex-col gap-5">
                                                {/* Summary Card */}
                                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-neutral-500">
                                                            {searchedTicket.id}
                                                        </span>
                                                        <Badge
                                                            className={cn(
                                                                "text-[10px] font-bold px-2 py-0.5",
                                                                searchedTicket.status === 'DONE' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                                searchedTicket.status === 'ON PROGRESS' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                                searchedTicket.status === 'OPEN' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                                            )}
                                                        >
                                                            {searchedTicket.status}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="mt-2 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                        {searchedTicket.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                        {searchedTicket.description}
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap justify-between border-t border-neutral-200 pt-3 text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                                                        <span>Teknisi: <strong className="text-neutral-700 dark:text-neutral-300">{searchedTicket.agent}</strong></span>
                                                        <span>Tgl Lapor: {searchedTicket.date}</span>
                                                    </div>
                                                </div>

                                                {/* Timeline Progres */}
                                                <div className="flex flex-col gap-4">
                                                    <h4 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                                        Riwayat Penanganan
                                                    </h4>
                                                    <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 flex flex-col gap-5">
                                                        {searchedTicket.updates.map((update, idx) => {
                                                            const isLast = idx === searchedTicket.updates.length - 1;
                                                            return (
                                                                <div key={idx} className="relative">
                                                                    {/* Dot marker */}
                                                                    <span className={cn(
                                                                        "absolute -left-[31px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border bg-white dark:bg-neutral-950",
                                                                        isLast ? "border-red-500 text-red-500" : "border-neutral-300 text-neutral-400 dark:border-neutral-700"
                                                                    )}>
                                                                        {isLast ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-2.5 w-2.5" />}
                                                                    </span>
                                                                    <p className={cn(
                                                                        "text-xs leading-normal",
                                                                        isLast ? "font-semibold text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"
                                                                    )}>
                                                                        {update}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : lookupExecuted ? (
                                            <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-800">
                                                <AlertTriangle className="mx-auto h-8 w-8 text-neutral-400" />
                                                <h4 className="mt-3 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    Tiket Tidak Ditemukan
                                                </h4>
                                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Pastikan nomor tiket Anda sesuai format (misalnya: TKT-202607-0001). Hubungi admin jika Anda baru saja mendaftarkan laporan Anda.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
                                                <RefreshCw className="mx-auto h-8 w-8 text-neutral-300 dark:text-neutral-700" />
                                                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Masukkan kode tiket di atas untuk memulai pelacakan status penanganan.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </section>

                {/* Section: Live System Status Operational */}
                <section id="status" className="border-y border-neutral-200 bg-neutral-100/50 py-8 dark:border-neutral-800 dark:bg-neutral-900/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

                            {/* Live operational header */}
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3.5 w-3.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500"></span>
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Status Layanan IT Damkar
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Semua sistem utama beroperasi normal
                                    </p>
                                </div>
                            </div>

                            {/* Status tags grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full md:w-auto">
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200/60 bg-white px-3.5 py-2 shadow-xs dark:border-neutral-800/80 dark:bg-[#111111]">
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">SIAGA API</span>
                                    <Badge className="h-5 bg-emerald-500/10 text-emerald-600 font-bold dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] hover:bg-emerald-500/10">99.9%</Badge>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200/60 bg-white px-3.5 py-2 shadow-xs dark:border-neutral-800/80 dark:bg-[#111111]">
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">CC DAMKAR 112</span>
                                    <Badge className="h-5 bg-emerald-500/10 text-emerald-600 font-bold dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] hover:bg-emerald-500/10">100%</Badge>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200/60 bg-white px-3.5 py-2 shadow-xs dark:border-neutral-800/80 dark:bg-[#111111]">
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">SIAP DAMKAR</span>
                                    <Badge className="h-5 bg-emerald-500/10 text-emerald-600 font-bold dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] hover:bg-emerald-500/10">99.9%</Badge>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200/60 bg-white px-3.5 py-2 shadow-xs dark:border-neutral-800/80 dark:bg-[#111111]">
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">HELPDESK</span>
                                    <Badge className="h-5 bg-emerald-500/10 text-emerald-600 font-bold dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] hover:bg-emerald-500/10">100%</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Service scope & Grid features */}
                <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                            Cakupan Layanan IT Bidang Jasinfo
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-400">
                            Kami menyediakan dukungan teknis komprehensif bagi seluruh pos pemadam, penyelamat, hingga kantor dinas pemadam DKI Jakarta.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Box 1: Support SI */}
                        <div className="group rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-md dark:border-neutral-800 dark:bg-[#121212] dark:hover:border-red-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <Laptop className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-800 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
                                Support Aplikasi & SI
                            </h3>
                            <p className="mt-2 text-xs leading-normal text-neutral-500 dark:text-neutral-400">
                                Penanganan bug data, error absensi E-Satgas, troubleshooting Dashboard Damkar, serta integrasi SIAGA API dinas.
                            </p>
                        </div>

                        {/* Box 2: Technical Support */}
                        <div className="group rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-md dark:border-neutral-800 dark:bg-[#121212] dark:hover:border-red-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <Network className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-800 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
                                Jaringan & IT Support
                            </h3>
                            <p className="mt-2 text-xs leading-normal text-neutral-500 dark:text-neutral-400">
                                Penanganan koneksi internet terputus di Pos Pemadam, instalasi printer dinas, konfigurasi CCTV Pos, dan switch jaringan LAN.
                            </p>
                        </div>

                        {/* Box 3: Data extraction */}
                        <div className="group rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-md dark:border-neutral-800 dark:bg-[#121212] dark:hover:border-red-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <Database className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-800 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
                                Layanan Ekstraksi Data
                            </h3>
                            <p className="mt-2 text-xs leading-normal text-neutral-500 dark:text-neutral-400">
                                Permintaan ekspor data statistik kejadian kebakaran, penyelamatan damkar, data personil dinas untuk pelaporan instansi luar.
                            </p>
                        </div>

                        {/* Box 4: Account management */}
                        <div className="group rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-md dark:border-neutral-800 dark:bg-[#121212] dark:hover:border-red-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-neutral-800 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
                                Manajemen Akun IT
                            </h3>
                            <p className="mt-2 text-xs leading-normal text-neutral-500 dark:text-neutral-400">
                                Pembuatan akun SIAGA/SIAP Damkar Baru, pemulihan akses (reset password) akun, dan pengaturan hak akses peran di sistem.
                            </p>
                        </div>
                    </div>

                    {/* Operational counter stats */}
                    <div className="mt-16 rounded-2xl bg-neutral-900 p-8 dark:bg-[#141414]">
                        <div className="grid gap-6 text-center sm:grid-cols-3">
                            <div className="flex flex-col justify-center border-b border-neutral-800 pb-6 sm:border-r sm:border-b-0 sm:pb-0">
                                <span className="text-3xl font-extrabold text-white">2.450+</span>
                                <span className="mt-2 text-xs text-neutral-400 uppercase font-semibold">Tiket Diselesaikan</span>
                            </div>
                            <div className="flex flex-col justify-center border-b border-neutral-800 pb-6 sm:border-r sm:border-b-0 sm:pb-0">
                                <span className="text-3xl font-extrabold text-white">&lt; 30 Menit</span>
                                <span className="mt-2 text-xs text-neutral-400 uppercase font-semibold">Rata-rata Respon Awal</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-3xl font-extrabold text-white">98.6%</span>
                                <span className="mt-2 text-xs text-neutral-400 uppercase font-semibold">Indeks Kepuasan Petugas</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: FAQs Accordion with Tab Filters */}
                <section id="faq" className="border-t border-neutral-200 bg-neutral-100/50 py-16 dark:border-neutral-800 dark:bg-neutral-900/10 sm:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                                FAQ & Informasi Solusi Mandiri
                            </h2>
                            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Pelajari solusi mandiri atas kendala umum sebelum membuat laporan untuk menghemat waktu penanganan.
                            </p>
                        </div>

                        {/* FAQ Filters Tabs */}
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {(['all', 'jaringan', 'aplikasi', 'hardware'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveFaqTab(tab);
                                        setExpandedFaqId(null);
                                    }}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border",
                                        activeFaqTab === tab
                                            ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900"
                                            : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-100 dark:bg-[#111111] dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                    )}
                                >
                                    {tab === 'all' ? 'Semua Kategori' : tab}
                                </button>
                            ))}
                        </div>

                        {/* FAQ Accordion List */}
                        <div className="mt-8 flex flex-col gap-4">
                            {filteredFaqs.map((faq) => {
                                const isExpanded = expandedFaqId === faq.id;
                                return (
                                    <div
                                        key={faq.id}
                                        className="rounded-xl border border-neutral-200/70 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-[#111111] transition-all"
                                    >
                                        <button
                                            onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                                            className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-200"
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDown className={cn(
                                                "h-5 w-5 text-neutral-400 transition-transform duration-250",
                                                isExpanded && "rotate-180 text-red-500"
                                            )} />
                                        </button>
                                        {isExpanded && (
                                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Section: Division Contact & Hotline */}
                <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="rounded-3xl bg-red-650 px-6 py-12 text-center text-white dark:bg-red-950/20 dark:border dark:border-red-900/40 shadow-xl sm:px-12 sm:py-16">
                        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Butuh bantuan mendesak untuk Pos Damkar?
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-sm text-red-100">
                            Tim teknisi Bidang Jasinfo siap memberikan respon cepat jika terjadi kendala infrastruktur sistem pemadaman utama.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                            <a href="https://wa.me/6285119995113" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-xs">
                                <Phone className="h-5 w-5 text-red-200" />
                                <span>WhatsApp Helpdesk: <strong>+62 851-1999-5113</strong></span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer Component */}
                <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-[#0c0c0c] text-neutral-500 dark:text-neutral-400">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Division Profile */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded bg-red-500/10 p-0.5 dark:bg-red-500/20">
                                        <img src={toAsset('/pampi-head.png')} alt="Pampi Logo" className="h-full w-full object-contain" />
                                    </div>
                                    <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                                        Bidang Jasinfo Disgulkarmat
                                    </h4>
                                </div>
                                <p className="text-xs leading-normal">
                                    Penyediaan prasarana, sarana pengolahan data, telekomunikasi, dan sistem informasi penanggulangan kebakaran dan penyelamatan DKI Jakarta.
                                </p>
                            </div>

                            {/* Links */}
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-xs uppercase tracking-wider">
                                    Tautan Cepat
                                </h4>
                                <ul className="flex flex-col gap-1.5 text-xs">
                                    <li><a href="https://pemadam.jakarta.go.id" target="_blank" className="hover:text-red-500 flex items-center gap-1">Website Resmi Dinas <ExternalLink className="h-3 w-3" /></a></li>
                                    <li><a href="https://siagaapi.jakarta.go.id" target="_blank" className="hover:text-red-500 flex items-center gap-1">Siaga Api <ExternalLink className="h-3 w-3" /></a></li>
                                    <li><a href="https://pemadam.jakarta.go.id/kontak" target="_blank" className="hover:text-red-500 flex items-center gap-1">Layanan Pengaduan 112 <ExternalLink className="h-3 w-3" /></a></li>
                                </ul>
                            </div>

                            {/* Location Address */}
                            <div className="flex flex-col gap-3">
                                <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-xs uppercase tracking-wider">
                                    Sekretariat / CC Damkar
                                </h4>
                                <p className="text-xs leading-normal flex items-start gap-2">
                                    <MapPin className="h-5 w-5 text-neutral-400 shrink-0" />
                                    <span>
                                        Dinas Penanggulangan Kebakaran & Penyelamatan DKI Jakarta, Bidang Jasinfo, Lantai 8. Jl. KH. Zainul Arifin No.71, Jakarta Pusat.
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs dark:border-neutral-800">
                            <p>© 2026 Dinas Penanggulangan Kebakaran & Penyelamatan Provinsi DKI Jakarta. All Rights Reserved. IT Helpdesk developed by Bidang Jasinfo.</p>
                        </div>
                    </div>
                </footer>

                {/* Dialog Detail Help Article Modal */}
                {selectedArticle && (
                    <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
                        <DialogContent className="sm:max-w-md bg-white dark:bg-[#0c0c0c]">
                            <DialogHeader>
                                <Badge className="w-fit text-[10px] uppercase font-bold tracking-wider mb-2 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/10">
                                    {selectedArticle.category}
                                </Badge>
                                <DialogTitle className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                                    {selectedArticle.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs mt-1 text-neutral-500">
                                    Materi Solusi Mandiri Jasinfo
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 bg-neutral-50 p-4 rounded-xl border border-neutral-200/50 dark:bg-neutral-900/40 dark:border-neutral-800/80">
                                {selectedArticle.content}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={() => setSelectedArticle(null)}
                                    className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs"
                                >
                                    Selesai Membaca
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

            </div>
        </>
    );
}
