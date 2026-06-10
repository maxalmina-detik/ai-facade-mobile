import { Article, Reel } from './types';

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    title: 'Lamine Yamal Siap Tampil di Piala Dunia 2026',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiWjc-53xx46S7qz7rgJoJOabtFiRHlknhaUGY8zAXRkUQ-rFQRvBMnauIYZaK2pYQoTEGEATAEgduQbAzKGv4pWfxtZMHJAsRiKRVYy8XgxIppBLanPMQk_nCl50C_cB2YqLYq9BTKMqppIaYqGWwmeWFrvQU0uxRn7FXOXKUvbP03KR8PVI5vjSt_VU3N7mznvZebLmotYzsTKwRAZKs5hU_pfn9Xtz_Riab7J-yKVyUMb9-KSbeE5fw28trnGTGrYH38LIqNeI',
    imageAlt: 'A portrait of a young soccer player in a blue and red jersey holding a yellow object, standing next to an older man with glasses and a beard in a dark blue polo shirt.',
    sourceLabel: 'World Cup Speculation'
  },
  {
    id: 'reel-2',
    title: 'Pidato Perpisahan Tim Cook Sebagai CEO Apple',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-uWLIKfGFrAAY9V_Vjytn-KEcGodcFTvXOyM-uH-vlcZHldJDMw1jgfucyh3rU4emdz7dWkyWj60gpR-KzdwHtsugKWlsLF5GW6TISwJEnBOrUvqrhLqDEWXn4d0o1wYDLZtdN2QA9SForTCK1knINhaLgl-OJ2fKNdo_fYiUsy0Ia5woM6iMuPDWrs3M6OSZ9J26pVHjDlE7CXWdM1YoyWTTtekHiGmqQVVsKzItOCGuF3JPeGMujCsA3bOh4JDUVIJ-Qtm25DI',
    imageAlt: 'A portrait of an older man with white hair and glasses wearing a black shirt, smiling warmly with his hands clasped together.',
    sourceLabel: 'Apple Transition'
  },
  {
    id: 'reel-3',
    title: 'MOMEN NIKITA WILLY CEK KULIT PAKAI AI HASILNYA BIKIN SYOK!',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2d0VIcOm355R520OdEFJNMLZ0_vDVmlX2JeMpVNDqWRNo30PoSsdz1na3AWKZFzn4efcRmOqCBrM3BhkpyKE0RwX3UuY7lGqzu0z8aTS13QDpg1UkSAOkT1y53DPON5UnLcslium47bM_Mg_NHNpCMK6sXn6aKmsifXMeTxP_RdXsNb7ZNB56--KWIrldcTkuOeP1pzhxnQZLx9c_0DJwOGiJQ_vb5v0NqteEVxJCxHvtQMYs93M3jvFxj4MUkvOLlzi4WkPJQxM',
    imageAlt: 'A woman wearing a light-colored hijab and modest outfit standing in front of a large digital screen displaying text. She is smiling and gesturing.',
    sourceLabel: 'AI Skincare Check'
  },
  {
    id: 'reel-4',
    title: 'Situasi Terkini Keadaan Gedung DPR Selama Sidang Paripurna',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4KtBeIOYqtkjNAeuveS4qOgI3-Zm0qshQPqkhf8v_CClcAowm5iMR1Qy5OFn15X34FKhExcICx5aFH-WieBqpp5sYI9ZEv7Va5RtHr7Uv4jnD0UGpXz_AIVV7cKZ4azpHR1Z-rSuV8YO01cjUNB6JPPJsknfTo9TTS5sXikFclF6JOrqdUqo1FB-B80SDDwAhaZRvzvMW1WUkqYUTpmlm5KOSZCfof-cjv9uEsBdnuBesl68MGW8fbYp5oHhz61a0QxvNAWsDgRY',
    imageAlt: 'A partial view of a news event showing microphones clustered together, indicating a press conference setting.',
    sourceLabel: 'Live Press Briefing'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Pramono Minta Pelaku Perusakan Kabel Lift JPO Lenteng Agung Diinvestigasi',
    category: 'detikNews',
    subCategory: 'Jabodetabek',
    content: [
      'Calon Gubernur Jakarta nomor urut 3, Pramono Anung, memberikan respons tegas terkait peristiwa perusakan kabel lift Jembatan Penyeberangan Orang (JPO) di kawasan Lenteng Agung, Jakarta Selatan.',
      'Menurut Pramono, fasilitas umum yang dibangun menggunakan anggaran pendapatan dan belanja daerah (APBD) harus dijaga bersama-sama karena menyangkut kepentingan mobilitas masyarakat luas, khususnya para penyandang disabilitas, lansia, dan ibu hamil.',
      '"Fasilitas publik seperti lift JPO ini sangat krusial bagi warga. Tindakan vandalisme atau perusakan kabel yang membuat operasional lift terganggu jelas tidak bisa ditoleransi. Saya meminta aparat penegak hukum segera melakukan investigasi mendalam," ujar Pramono saat ditemui di sela-sela kegiatannya.',
      'Sebelumnya, dilaporkan bahwa lift di JPO Lenteng Agung mendadak mati total. Setelah dilakukan pemeriksaan oleh petugas teknis Dinas Bina Marga Provinsi DKI Jakarta, ditemukan bahwa beberapa kabel transmisi tenaga dan sensor lift telah dipotong secara sengaja oleh pihak yang tidak bertanggung jawab.',
      'Warga Lenteng Agung berharap pelaku segera ditangkap untuk menghindari kejadian serupa terjadi di fasilitas JPO lainnya di wilayah Jakarta Selatan. Pihak kepolisian sektor setempat juga telah mengonfirmasi bahwa mereka tengah memeriksa rekaman CCTV di sekitar lokasi kejadian guna mengidentifikasi terduga pelaku.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUWb9YqOpIwzu56GX6udDM2XxmzB9B3NVUpjyhXxOAL0qe8OVFDykOTOiCmEyTz7w1Q_JN9pTSyyOtLJmquHFt7LgG-y5jiuRULeSbPAnwosbdkZJvApNklpIBWcfdWuj4kE0pGavv7N_ho4KYjomn2pmfPCli0PHKr9FCBory3MzOEZr9qxYQq8WxXcPOaedS92KWmBEOUSc06bJQOJmvAyIwfl_XHK7J0fFLrIUVyX-m4vY3CD_XeaswO1Ag0inojpkmALh28qc',
    imageAlt: 'A group of people standing outdoors during the day with Pramono Anung speaking into multiple microphones wearing a white collared shirt.',
    publishedAt: 'Rabu, 10 Jun 2026 12:45 WIB',
    author: 'Aditya Pratama',
    readsCount: 14205,
    breaking: true,
    likes: 348,
    comments: [
      {
        id: 'c1',
        userName: 'Budi Santoso',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Pelaku harus dihukum berat! Ini lift buat lansia dan difabel malah dirusak kabelya. Tega banget.',
        createdAt: '10 Mins Ago'
      },
      {
        id: 'c2',
        userName: 'Dewi Lestari',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'CCTV kan banyak di sana, tolong segera diperiksa. Semoga cepat terungkap pelakunya.',
        createdAt: '5 Mins Ago'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Menanti Putusan Rencana Penghapusan Tunggakan Iuran BPJS Kesehatan',
    category: 'Detik Pagi',
    subCategory: 'Nasional',
    content: [
      'Pemerintah bersama Dewan Jaminan Sosial Nasional (DJSN) dan BPJS Kesehatan kini tengah mematangkan perumusan draf regulasi mengenai rencana pemutihan atau penghapusan sebagian tunggakan iuran bagi kepesertaan aktif jaminan kesehatan nasional.',
      'Langkah taktis ini diwacanakan sebagai upaya untuk meringankan beban finansial masyarakat berpenghasilan rendah sekaligus memulihkan status kepesertaan yang non-aktif agar kembali mendapatkan jaminan layanan kesehatan penuh tanpa hambatan admisi.',
      'Menurut Direktur Utama BPJS Kesehatan, besaran tunggakan yang menumpuk selama beberapa tahun terakhir cukup masif dan berdampak langsung pada kelancaran cash flow operasional rumah sakit rujukan. Dengan pemutihan ini, diharapkan partisipasi pembayaran iuran mandiri ke depan akan lebih disiplin.',
      'Sambil menanti putusan final yang dijadwalkan meluncur akhir bulan ini, masyarakat dihimbau untuk tetap mengecek status kartu BPJS masing-masing secara online lewat aplikasi Mobile JKN guna menghindari hambatan ketika membutuhkan perawatan darurat.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO82aQtcON-TWLQDLjuZ3okjGYc8uh-_UE7Q97K1wJwi0Bl2QFPGYdmgXpvFSGzvfUa12XKIRwsVZH3zGFTLO-xRagwokRgSEKqD62vFCuqR176_ZI4gVZ-jDFIeV2tDWDzOVQyDxwhx3sRNsPoQAdm3GZqgF-AGA8EJk39bF9NLjFFazKjdWJRvyXJ7cWEeu-70aOMf_k9ytYNxvPhaQ-vuWaGVS9MfNvnXVgxR9lbEXC0VXGt5EIQjhkAqOtSUHWPYcKe-prU7Y',
    imageAlt: 'A news thumbnail showing two news anchors, a man and a woman, standing against a bright yellow graphic background with abstract shapes in a newsroom studio.',
    publishedAt: 'Rabu, 10 Jun 2026 07:30 WIB',
    author: 'Rina Wijaya',
    readsCount: 8943,
    likes: 198,
    comments: [
      {
        id: 'c3',
        userName: 'Ahmad Faisal',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Ini info bagus, banyak tetangga saya yang kartunya mati karena gak sanggup bayar denda tunggakan berbulan-bulan.',
        createdAt: '1 Hour Ago'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Tim Apple Sambut Transisi CEO, Tim Cook Berikan Pesan Haru',
    category: 'detikInet',
    subCategory: 'Gadget',
    content: [
      'Setelah memimpin raksasa teknologi Apple selama lebih dari satu dekade, Tim Cook secara resmi mengumumkan peta jalan suksesi kepemimpinan Apple. Dalam memo internal yang mengharukan, ia menyampaikan rasa terima kasih mendalam atas komitmen seluruh tim global.',
      'Tim Cook menegaskan bahwa kekuatan Apple bukan terletak pada produk melainkan kolaborasi harmonis manusia di dalamnya yang berupaya merancang dunia menjadi tempat yang lebih baik.',
      '"Setiap peluncuran produk, setiap inovasi, dan setiap tantangan yang kita lalui bersama telah membentuk budaya luar biasa ini," tulisnya. Transisi berjalan mulus dengan beberapa kandidat terkuat internal yang siap melanjutkan tongkat estafet inovasi.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-uWLIKfGFrAAY9V_Vjytn-KEcGodcFTvXOyM-uH-vlcZHldJDMw1jgfucyh3rU4emdz7dWkyWj60gpR-KzdwHtsugKWlsLF5GW6TISwJEnBOrUvqrhLqDEWXn4d0o1wYDLZtdN2QA9SForTCK1knINhaLgl-OJ2fKNdo_fYiUsy0Ia5woM6iMuPDWrs3M6OSZ9J26pVHjDlE7CXWdM1YoyWTTtekHiGmqQVVsKzItOCGuF3JPeGMujCsA3bOh4JDUVIJ-Qtm25DI',
    imageAlt: 'CEO Apple Tim Cook smiling with white hair and glasses.',
    publishedAt: 'Selasa, 09 Jun 2026 18:20 WIB',
    author: 'M. Firman',
    readsCount: 22432,
    likes: 549,
    comments: [
      {
        id: 'c4',
        userName: 'Andi Tech',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Legacy yang luar biasa dari Tim Cook setelah Steve Jobs. Penasaran siapa penggantinya.',
        createdAt: '2 Hours Ago'
      }
    ]
  },
  {
    id: 'art-4',
    title: 'Kecanggihan AI Bantu Deteksi Kondisi Kulit Sensitif dalam 10 Detik',
    category: 'Lifestyle',
    subCategory: 'Beauty & Health',
    content: [
      'Pemanfaatan kecerdasan buatan (Artifical Intelligence) dalam industri dermatologi kian matang. Baru-baru ini, pameran kecantikan internasional memperkenalkan perangkat genggam pintar yang mampu menganalisis tekstur kulit, kelembaban, dan tingkat iritasi secara real-time.',
      'Nikita Willy, salah satu pesohor tanah air yang berkesempatan mencoba perangkat ini secara langsung menyatakan kekagumannya atas akurasi data yang ditampilkan secara instan.',
      'Teknologi ini memindai titik mikroskopis pori kulit wajah lalu mencocokkannya dengan jutaan data klinis seketika untuk merumuskan saran penggunaan skincare yang ideal secara personal.',
      'Masyarakat sangat menyukai kemudahan ini karena terhindar dari salah beli skincare yang memicu alergi berbahaya bagi kulit wajah yang sensitif.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2d0VIcOm355R520OdEFJNMLZ0_vDVmlX2JeMpVNDqWRNo30PoSsdz1na3AWKZFzn4efcRmOqCBrM3BhkpyKE0RwX3UuY7lGqzu0z8aTS13QDpg1UkSAOkT1y53DPON5UnLcslium47bM_Mg_NHNpCMK6sXn6aKmsifXMeTxP_RdXsNb7ZNB56--KWIrldcTkuOeP1pzhxnQZLx9c_0DJwOGiJQ_vb5v0NqteEVxJCxHvtQMYs93M3jvFxj4MUkvOLlzi4WkPJQxM',
    imageAlt: 'A woman in light Modest clothing exploring AI skin parameters on a digital panel display.',
    publishedAt: 'Senin, 08 Jun 2026 15:40 WIB',
    author: 'Siti Rahma',
    readsCount: 16843,
    likes: 421,
    comments: [
      {
        id: 'c5',
        userName: 'Salsa Bila',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Bagus banget inovasinya! Gak perlu tebak-tebak tipe kulit lagi deh.',
        createdAt: '3 Hours Ago'
      }
    ]
  },
  {
    id: 'art-5',
    title: 'Gila Bola: Lamine Yamal Janjikan Kemenangan untuk Spanyol di Piala Dunia 2026',
    category: 'detikSport',
    subCategory: 'Sepakbola',
    content: [
      'Wonderkid asal Spanyol, Lamine Yamal, memantapkan fokusnya menjelang turnamen termegah sepak bola jagad raya. Dengan usia yang sangat belia, Yamal memikul ekspektasi tinggi demi mengembalikan kejayaan La Roja.',
      'Pelatih kepala Spanyol memuji kematangan mentalitas Yamal di lapangan hijau. Skema taktis lincah di sisi sayap diprediksi akan merepotkan barisan pertahanan lawan mana pun.',
      'Bagi para pecinta sepak bola, kehadiran Lamine Yamal dinanti-nantikan sebagai lahirnya ikon baru sepak bola modern dengan skill olah bola memukau dan kecepatan murni.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiWjc-53xx46S7qz7rgJoJOabtFiRHlknhaUGY8zAXRkUQ-rFQRvBMnauIYZaK2pYQoTEGEATAEgduQbAzKGv4pWfxtZMHJAsRiKRVYy8XgxIppBLanPMQk_nCl50C_cB2YqLYq9BTKMqppIaYqGWwmeWFrvQU0uxRn7FXOXKUvbP03KR8PVI5vjSt_VU3N7mznvZebLmotYzsTKwRAZKs5hU_pfn9Xtz_Riab7J-yKVyUMb9-KSbeE5fw28trnGTGrYH38LIqNeI',
    imageAlt: 'Portrait of Lamine Yamal and his mentor next to red and blue colors.',
    publishedAt: 'Selasa, 09 Jun 2026 21:10 WIB',
    author: 'Doni Arman',
    readsCount: 29014,
    likes: 1205,
    comments: [
      {
        id: 'c6',
        userName: 'BarcaFans',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Yamal adalah masa depan sepak bola! Spanyol bakal kuat bgt.',
        createdAt: '4Hours Ago'
      }
    ]
  }
];

export const OTHER_TRENDING_NEWS: Article[] = [
  {
    id: 'trending-1',
    title: 'Pasar Saham Meroket Akibat Antusiasme Adopsi Energi Terbarukan Nasional',
    category: 'detikFinance',
    subCategory: 'Saham',
    content: [
      'Indeks rujukan saham nasional berpijak kokoh di zona hijau berkat masifnya volume transaksi pada emiten energi baru terbarukan (EBT) menyusul regulasi insentif pajak kendaraan listrik teranyar.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=300&h=200&q=80',
    imageAlt: 'Stock market visual graphs climbing higher red and green bars.',
    publishedAt: 'Rabu, 10 Jun 2026 10:15 WIB',
    author: 'Sandro Siregar',
    readsCount: 7122,
    likes: 145,
    comments: []
  },
  {
    id: 'trending-2',
    title: 'Eksplorasi Keindahan Alam Dieng: Wisata di Atas Awan yang Memesona',
    category: 'Lifestyle',
    subCategory: 'Travel',
    content: [
      'Negeri di atas awan Dieng kembali dipadati wisatawan domestik yang ingin merasakan fenomena embun upas dingin ekstrem dan indahnya matahari terbit di puncak Sikunir.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&h=200&q=80',
    imageAlt: 'Beautiful serene mountains landscape in Dieng morning mist.',
    publishedAt: 'Selasa, 09 Jun 2026 14:00 WIB',
    author: 'Vina Amelia',
    readsCount: 9410,
    likes: 284,
    comments: []
  }
];

export const BREAKING_NEWS_TICKER = {
  id: 'breaking-active',
  title: 'BREAKING NEWS: Gempa Magnitudo 5.2 Guncang Malang, Tidak Berpotensi Tsunami',
  link: '#'
};
