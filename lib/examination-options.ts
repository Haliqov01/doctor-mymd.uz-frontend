// Göz muayenesi için önceden tanımlanmış seçenekler
// RAPOR_SISTEMI.md'den alınan tam liste

export const EXAMINATION_OPTIONS = {
  // Ko'z olmasi (Göz Küresi)
  globe: [
    "normada",
    "subatrofiya",
    "atrofiya",
    "mikroftalm",
    "gidroftalm",
    "buftalm",
  ],
  
  // Ko'z mushaklari (Göz Kasları)
  muscles: [
    "Faol, barcha tomonga harakat to'liq saqlangan",
    "harakat yo'q",
    "harakat cheklangan",
    "nistagm",
  ],
  
  // Qovoqlar va ko'z yosh yo'llari (Kapaklar ve Gözyaşı Yolları)
  lidsAndLacrimal: [
    "Qovoqlar holati to'g'ri, yumilishi to'liq",
    "qovoqlar yumilishi qisman",
    "ptoz",
    "qisman ptoz",
    "pastki qovoqning tashqariga ag'darilishi",
    "pastki qovoq ichkariga ag'darilishi",
  ],
  
  // Konyunktiva (Konjonktiva)
  conjunctiva: [
    "och pushti, yupqa, silliq, yaltiroq, ajralma yo'q",
    "giperemiya",
    "limb sohasida qalinlashgan",
    "giposfagma - mahalliy",
    "giposfagma - sektoral",
    "giposfagma - diffuz",
    "etdor, uchburchak shaklidagi o'sma",
    "nevus",
  ],
  
  // Sklera
  sclera: [
    "normada",
    "filtratsion yostiq ko'tarilib turibdi",
    "filtratsion yostiq yassi",
    "skleromalyatsiya",
    "mahalliy tomirlar inyektsiyasi",
    "tomirlarining diffuz inyektsiyasi",
    "tomirlarining sektoral inyektsiyasi",
  ],
  
  // Shox parda (Kornea)
  cornea: [
    "Shaffof",
    "yuzaki hiralanish",
    "chuqur hiralanish",
    "oq dog' I toifa",
    "oq dog' II toifa",
    "oq dog' III toifa",
    "oq dog' IV toifa",
    "yot jism",
    "epiteliopatiya",
    "eroziya",
    "infiltrat",
    "konyunktiva o'smasi",
    "jarrohlik o'rni",
  ],
  
  // Old kamera va ko'z ichi suyuqligi (Ön Kamara)
  anteriorChamber: [
    "o'rta chuqurlikda, suyuqligi shaffof",
    "sayoz >2.5",
    "sayoz <2.5",
    "hujayraviy reaksiya +",
    "hujayraviy reaksiya ++",
    "hujayraviy reaksiya +++",
    "fibrin",
    "gipopion <1 mm",
    "gipopion <2 mm",
    "gipopion <3 mm",
    "gipopion >3 mm",
    "gifema<1mm",
    "gifema<2mm",
    "gifema<3mm",
  ],
  
  // Rangdor parda va qorachiq (İris ve Pupil)
  irisAndPupil: [
    "rangi va relyefi saqlangan, Ø3.0 мм, reak.jonli",
    "profil to'g'ri",
    "profil yassi",
    "profil qavariq",
    "PES+",
    "PES++",
    "PES+++",
  ],
  
  // Gavhar (Lens)
  lens: [
    "shaffof",
    "fakoskleroz",
    "kortikal qavatlarda hiralashgan",
    "kortikal va mag'iz qavatlarda hiralashgan",
    "orqa subkapsulyar qavatlarda hiralashgan",
    "barcha qavatlar hiralashgan",
    "gavhar orqa kapsulasi hiralashgan",
    "IOL hiralashgan",
    "gavhar yo'q, IOL markazda",
    "lazer distsiyadan keyingi holat",
    "CS +",
    "CS ++",
    "CS +++",
    "NC+",
    "NC++",
    "NC+++",
    "NO+",
    "NO++",
    "NO+++",
    "PSC+",
    "PSC++",
    "PSC+++",
  ],
  
  // Shishasimon tana (Vitreus)
  vitreous: [
    "o'zgarishsiz",
    "destruktiv o'zgarishlar",
    "Veys xalqasi",
    "kumush yomg'ir simptomi",
    "oltin yomg'ir simptomi",
    "qisman gemoftalm",
    "total gemoftalm",
  ],
  
  // Ko'z tubi (Fundus)
  fundus: [
    "Ko'z tubi pushti, chegaralari aniq, tomirlar normal, makula mintaqasi tekis",
    "Ko'z sinir diskining chegaralari noaniq (zastoy)",
    "Ko'z sinir diskining rangi oqarib ketgan (atrofiya)",
    "Ko'z sinir diskining excavatsiyasi kengaygan (glaukoma)",
    "Ko'z sinir diskining excavatsiyasi C/D = 0.3",
    "Ko'z sinir diskining excavatsiyasi C/D = 0.5",
    "Ko'z sinir diskining excavatsiyasi C/D = 0.7",
    "Ko'z sinir diskining excavatsiyasi C/D = 0.9",
    "Retina otkreshgan (dekolman)",
    "Retinada qon ketishlar",
    "Retinada ekssudatlar (qattiq)",
    "Retinada ekssudatlar (yumshoq)",
    "Retinada mikroanevrizmalar",
    "Diabetik retinopatiya belgilari",
    "Makula mintaqasida o'zgarishlar",
    "Makula degeneratsiyasi",
    "Makula ödemi",
    "Tomirlar toraygan",
    "Tomirlar bukchayib ketgan",
    "Tomirlar kengaygan",
    "Yangi qon tomirlar hosil bo'lgan (neovaskularizatsiya)",
    "Retina vena tiqilib qolgan",
    "Retina arteriya tiqilib qolgan",
    "Xorioretinit belgilari",
    "Pigment tarqalishi",
    "Teshik (makula teshigi)",
  ],
  
  // Ko'rish o'tkirligi standart qiymatlari
  visualAcuity: [
    "0 (nol)",
    "1",
    "0,9",
    "0,8",
    "0,7",
    "0,6",
    "0,5",
    "0,4",
    "0,3",
    "0,2",
    "0,1",
    "0,09",
    "0,08",
    "0,07",
    "0,06",
    "0,05",
    "0,04",
    "0,03",
    "0,02",
    "0,01",
    "barmoq sanash 40-45sm",
    "barmoq sanash 30-35sm",
    "barmoq sanash 20-25sm",
    "barmoq sanash 10-15sm",
    "barmoq sanash 5-10sm",
    "qo'l harakati",
    "1/8 pr.lucis certae",
    "1/8 pr.lucis incertae",
  ],
  
  // Tashxis (Tanı) - Asosiy göz hastalıkları
  diagnosis: [
    // Refraktiv bozukluklar
    "Miyopiya",
    "Gipermetropiya",
    "Astigmatizm",
    "Miksli astigmatizm",
    "Presbiopiya",
    "Anizometropiya",
    
    // Katarakt
    "Boshlanuvchi katarakt",
    "Noetil katarakt",
    "Etil katarakt",
    "Nuklear katarakt",
    "Kortikal katarakt",
    "Zadniy subkapsulyar katarakt",
    "Kongenital katarakt",
    
    // Glaukoma
    "Birlamchi ochiq burchakli glaukoma",
    "Birlamchi yopiq burchakli glaukoma",
    "O'tkir burchak yopilishi xujumi",
    "Ikkilamchi glaukoma",
    "Kongenital glaukoma",
    "Normal bosimli glaukoma",
    
    // Retina kasalliklari
    "Diabetik retinopatiya",
    "Gipertonik retinopatiya",
    "Retina dekolmani",
    "Markaziy retina venasi tiqilishi",
    "Markaziy retina arteriyasi tiqilishi",
    "Yoshga bog'liq makula degeneratsiyasi",
    "Makula ödemi",
    "Epiretinal membrana",
    "Makula teshigi",
    
    // Kornea kasalliklari
    "Keratokonus",
    "Bakterial keratit",
    "Viral keratit",
    "Kornea eroziyasi",
    "Kornea yazva",
    "Kornea distrofiyasi",
    "Kornea chandiq",
    
    // Yallig'lanish kasalliklari
    "Konyunktivit (bakterial)",
    "Konyunktivit (viral)",
    "Konyunktivit (allergik)",
    "Keratit",
    "Irit",
    "Iridosiklit",
    "Uveit",
    "Panuveit",
    "Endoftalmit",
    "Blefarit",
    "Dakriosistit",
    
    // Shashilik va boshqalar
    "Konkomitant shashilik",
    "Paralitik shashilik",
    "Ambliopiya",
    "Nistaqm",
    "Ptoz",
    "Entropion",
    "Ektropion",
    "Trichiaz",
    "Ksenoftalm",
    "Pterigium",
    "Quru ko'z sindromi",
    "Ko'z jarohatlari",
    "Chet jism",
  ],
  
  // Tavsiyalar (Öneriler)
  recommendations: [
    "Ko'zoynak buyurildi",
    "Linzalar buyurildi",
    "Dori vositalar buyurildi",
    "Jarrohlik amaliyoti tavsiya etiladi",
    "Katarakt operatsiyasi zarur",
    "Lazer davolash tavsiya etiladi",
    "Qo'shimcha tekshiruvlar zarur",
    "OCT tekshiruvi",
    "FFA (fluorestsentli angiografiya)",
    "Elektrofiziologik tekshiruv",
    "Nazorat muoyanasiga 1 oydan keyin",
    "Nazorat muoyanasiga 3 oydan keyin",
    "Nazorat muoyanasiga 6 oydan keyin",
    "Endokrinolog konsultatsiyasi",
    "Nevropatolog konsultatsiyasi",
    "Terapevt konsultatsiyasi",
    "Kardiolog konsultatsiyasi",
  ],

  // Shikoyatlar (Şikayetler)
  complaints: [
    "ko'rish pasayishi",
    "qichishish, qizarish, ajralma kelishi",
    "og'riq",
    "ko'z qurishi, bezovtalik",
    "ko'zoynak tanlash",
    "ko'z yoshlanishi",
    "suzib yurivchi hiralanishlar",
  ],

  // Yondosh kasalliklar (Komorbidite)
  comorbidities: [
    "Qandli diabet",
    "Gipertoniya kasalligi",
    "Bosh miya insulti",
    "Miokard infarti",
  ],

  // Jinsi (Cinsiyet)
  gender: [
    "erkak",
    "ayol",
  ],

  // Ko'z (Göz)
  eye: [
    "OD",
    "OS",
    "OU",
  ],

  // Manzil (Adres - Şehirler)
  cities: [
    "Toshkent sh",
    "Toshkent v.",
    "Andijon v.",
    "Buxoro v.",
    "Farg'ona v.",
    "Jizzah v.",
    "Namangan v.",
    "Navoiy v.",
    "Qashqadaryo v.",
    "Samarqand v.",
    "Sirdaryo v.",
    "Surxondaryo v.",
    "Xorazm v.",
    "Qoraqalpog'iston R.",
    "Qozog'iston",
    "Tojikiston",
    "Qirg'iziston",
  ],

  // KIB o'lchash usullari (Göz İçi Basıncı Ölçüm Yöntemleri)
  iopMethods: [
    "Pnevmo.",
    "Maklakov",
    "GAT",
    "Shiots",
    "icare",
  ],
};

// Standart normal qiymatlar
export const NORMAL_VALUES = {
  globe: "normada",
  muscles: "Faol, barcha tomonga harakat to'liq saqlangan",
  lidsAndLacrimal: "Qovoqlar holati to'g'ri, yumilishi to'liq",
  conjunctiva: "och pushti, yupqa, silliq, yaltiroq, ajralma yo'q",
  sclera: "normada",
  cornea: "Shaffof",
  anteriorChamber: "o'rta chuqurlikda, suyuqligi shaffof",
  irisAndPupil: "rangi va relyefi saqlangan, Ø3.0 мм, reak.jonli",
  lens: "shaffof",
  vitreous: "o'zgarishsiz",
  fundus: "Ko'z tubi pushti, chegaralari aniq, tomirlar normal, makula mintaqasi tekis",
};

