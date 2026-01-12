// Locale'e göre tıbbi terimleri döndüren helper
// Bu dosya, EXAMINATION_OPTIONS'daki Özbekçe terimleri dile göre çevirir

type TranslationFunction = (key: string) => string;

// Şikayetler için key mapping
const complaintsKeys = [
  "visionLoss",
  "itchingRednessDischarge", 
  "pain",
  "dryEyeDiscomfort",
  "glassesSelection",
  "tearing",
  "floaters",
];

// Komorbidteler için key mapping
const comorbiditiesKeys = [
  "diabetes",
  "hypertension",
  "stroke",
  "heartAttack",
];

// Globe için key mapping
const globeKeys = [
  "normal",
  "subatrophy",
  "atrophy",
  "microphthalmos",
  "hydrophthalmos",
  "buphthalmos",
];

// Muscles için key mapping
const musclesKeys = [
  "normal",
  "noMovement",
  "limitedMovement",
  "nystagmus",
];

// Lids and Lacrimal için key mapping
const lidsAndLacrimalKeys = [
  "normal",
  "partialClosure",
  "ptosis",
  "partialPtosis",
  "ectropion",
  "entropion",
];

// Conjunctiva için key mapping
const conjunctivaKeys = [
  "normal",
  "hyperemia",
  "limbusThickening",
  "localHyposphagma",
  "sectoralHyposphagma",
  "diffuseHyposphagma",
  "pterygium",
  "nevus",
];

// Sclera için key mapping
const scleraKeys = [
  "normal",
  "filteringBlebRaised",
  "filteringBlebFlat",
  "scleromalacia",
  "localVascularInjection",
  "diffuseVascularInjection",
  "sectoralVascularInjection",
];

// Cornea için key mapping
const corneaKeys = [
  "transparent",
  "superficialOpacity",
  "deepOpacity",
  "leucoma1",
  "leucoma2",
  "leucoma3",
  "leucoma4",
  "foreignBody",
  "epitheliopathy",
  "erosion",
  "infiltrate",
  "conjunctivalGrowth",
  "surgicalSite",
];

// Anterior Chamber için key mapping
const anteriorChamberKeys = [
  "normal",
  "shallow25",
  "shallow25Less",
  "cellularReaction1",
  "cellularReaction2",
  "cellularReaction3",
  "fibrin",
  "hypopyon1mm",
  "hypopyon2mm",
  "hypopyon3mm",
  "hypopyon3mmPlus",
  "hyphema1mm",
  "hyphema2mm",
  "hyphema3mm",
];

// Iris and Pupil için key mapping
const irisAndPupilKeys = [
  "normal",
  "profileCorrect",
  "profileFlat",
  "profileConvex",
  "pes1",
  "pes2",
  "pes3",
];

// Lens için key mapping
const lensKeys = [
  "transparent",
  "phacosclerosis",
  "corticalOpacity",
  "corticalNuclearOpacity",
  "posteriorSubcapsularOpacity",
  "totalOpacity",
  "posteriorCapsuleOpacity",
  "iolOpacity",
  "aphakiaIolCentered",
  "postLaserState",
  "cs1",
  "cs2",
  "cs3",
  "nc1",
  "nc2",
  "nc3",
  "no1",
  "no2",
  "no3",
  "psc1",
  "psc2",
  "psc3",
];

// Vitreous için key mapping
const vitreousKeys = [
  "unchanged",
  "destructiveChanges",
  "weissRing",
  "silverRainSymptom",
  "goldenRainSymptom",
  "partialHemophthalmos",
  "totalHemophthalmos",
];

// Fundus için key mapping
const fundusKeys = [
  "normal",
  "blurredDisc",
  "paleDisc",
  "enlargedExcavation",
  "excavation03",
  "excavation05",
  "excavation07",
  "excavation09",
  "retinalDetachment",
  "retinalHemorrhages",
  "hardExudates",
  "softExudates",
  "microaneurysms",
  "diabeticRetinopathy",
  "macularChanges",
  "macularDegeneration",
  "macularEdema",
  "narrowedVessels",
  "tortousVessels",
  "dilatedVessels",
  "neovascularization",
  "veinOcclusion",
  "arteryOcclusion",
  "chorioretinitis",
  "pigmentDispersion",
  "macularHole",
];

// IOP Methods için key mapping
const iopMethodsKeys = [
  "pneumo",
  "maklakov",
  "gat",
  "shiots",
  "icare",
];

// Gender için key mapping
const genderKeys = [
  "male",
  "female",
];

// Helper function to get translated options
function getTranslatedOptions(t: TranslationFunction, category: string, keys: string[]): string[] {
  return keys.map(key => t(`medicalTerms.${category}.${key}`));
}

// Ana export fonksiyonu
export function getLocalizedExaminationOptions(t: TranslationFunction) {
  return {
    complaints: getTranslatedOptions(t, "complaints", complaintsKeys),
    comorbidities: getTranslatedOptions(t, "comorbidities", comorbiditiesKeys),
    globe: getTranslatedOptions(t, "globe", globeKeys),
    muscles: getTranslatedOptions(t, "muscles", musclesKeys),
    lidsAndLacrimal: getTranslatedOptions(t, "lidsAndLacrimal", lidsAndLacrimalKeys),
    conjunctiva: getTranslatedOptions(t, "conjunctiva", conjunctivaKeys),
    sclera: getTranslatedOptions(t, "sclera", scleraKeys),
    cornea: getTranslatedOptions(t, "cornea", corneaKeys),
    anteriorChamber: getTranslatedOptions(t, "anteriorChamber", anteriorChamberKeys),
    irisAndPupil: getTranslatedOptions(t, "irisAndPupil", irisAndPupilKeys),
    lens: getTranslatedOptions(t, "lens", lensKeys),
    vitreous: getTranslatedOptions(t, "vitreous", vitreousKeys),
    fundus: getTranslatedOptions(t, "fundus", fundusKeys),
    iopMethods: getTranslatedOptions(t, "iopMethods", iopMethodsKeys),
    gender: getTranslatedOptions(t, "gender", genderKeys),
  };
}

// Normal değerler için çevirileri al
export function getLocalizedNormalValues(t: TranslationFunction) {
  return {
    globe: t("medicalTerms.globe.normal"),
    muscles: t("medicalTerms.muscles.normal"),
    lidsAndLacrimal: t("medicalTerms.lidsAndLacrimal.normal"),
    conjunctiva: t("medicalTerms.conjunctiva.normal"),
    sclera: t("medicalTerms.sclera.normal"),
    cornea: t("medicalTerms.cornea.transparent"),
    anteriorChamber: t("medicalTerms.anteriorChamber.normal"),
    irisAndPupil: t("medicalTerms.irisAndPupil.normal"),
    lens: t("medicalTerms.lens.transparent"),
    vitreous: t("medicalTerms.vitreous.unchanged"),
    fundus: t("medicalTerms.fundus.normal"),
  };
}

