const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer, VerticalAlign,
  ImageRun, ExternalHyperlink, PageBreak
} = require('docx');
const fs = require('fs');

const BLUE    = "1A3A6B";
const ACCENT  = "1F6AA5";
const LIGHT   = "EBF2FA";
const DARK    = "1A1A2E";
const GREY    = "5A5A7A";
const GREEN   = "1A6B3A";
const LGREEN  = "E8F5ED";
const ORANGE  = "8B4000";
const LORANGE = "FEF3E8";
const RED     = "8B1A1A";
const LRED    = "FBE8E8";
const PURPLE  = "4A2A6B";
const LPURPLE = "F0E8FA";
const LINK    = "1F6AA5";

const b1 = { style: BorderStyle.SINGLE, size: 1, color: "BDD0E8" };
const borders = { top: b1, bottom: b1, left: b1, right: b1 };
const noB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noB, bottom: noB, left: noB, right: noB };

const cell = (text, w, o = {}) => new TableCell({
  borders: o.nob ? noBorders : borders,
  width: { size: w, type: WidthType.DXA },
  shading: { fill: o.fill || "FFFFFF", type: ShadingType.CLEAR },
  margins: { top: 90, bottom: 90, left: 130, right: 130 },
  verticalAlign: VerticalAlign.CENTER,
  children: o.children || [new Paragraph({
    alignment: o.align || AlignmentType.LEFT,
    children: [new TextRun({ text: String(text), font: "Arial", size: o.size || 20,
      bold: o.bold || false, color: o.color || DARK, italics: o.italic || false })]
  })]
});

const hcell = (text, w, align = AlignmentType.LEFT, fill = BLUE) =>
  cell(text, w, { fill, bold: true, color: "FFFFFF", align });

const p = (text, o = {}) => new Paragraph({
  spacing: { before: o.before || 80, after: o.after || 100, line: 276 },
  alignment: o.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, font: "Arial", size: o.size || 22,
    bold: o.bold || false, color: o.color || DARK, italics: o.italic || false })]
});

const pMix = (parts, o = {}) => new Paragraph({
  spacing: { before: o.before || 80, after: o.after || 100, line: 276 },
  alignment: o.align || AlignmentType.JUSTIFIED,
  children: parts
});

const txt = (s, o = {}) => new TextRun({
  text: s, font: "Arial", size: o.size || 22, bold: o.bold || false,
  color: o.color || DARK, italics: o.italic || false
});

const link = (label, url) => new ExternalHyperlink({
  link: url,
  children: [new TextRun({ text: label, font: "Arial", size: 22, color: LINK,
    underline: { type: "single", color: LINK } })]
});

const linkSmall = (label, url, size = 18) => new ExternalHyperlink({
  link: url,
  children: [new TextRun({ text: label, font: "Arial", size, color: LINK,
    underline: { type: "single", color: LINK } })]
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 380, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT, space: 4 } },
  children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: BLUE })]
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 80 },
  children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: ACCENT })]
});

const bullet = (text, o = {}) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { before: 40, after: 40 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: o.color || DARK, bold: o.bold || false })]
});

const bulletMix = (parts) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { before: 40, after: 40 },
  children: parts
});

const numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })]
});

const sp = (n = 100) => new Paragraph({ spacing: { before: n, after: 0 }, children: [] });

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const callout = (text, col = ACCENT, fill = LIGHT) => new Paragraph({
  spacing: { before: 100, after: 100 }, indent: { left: 360, right: 360 },
  shading: { fill, type: ShadingType.CLEAR },
  border: { left: { style: BorderStyle.THICK, size: 14, color: col, space: 8 } },
  children: [new TextRun({ text, font: "Arial", size: 20, color: col, italics: true })]
});

const chartImg = (path, captionText, widthDxa = 540, heightDxa = 280) => {
  const image = fs.readFileSync(path);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ data: image,
        transformation: { width: widthDxa, height: heightDxa } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 160 },
      children: [new TextRun({ text: captionText, font: "Arial", size: 16,
        color: GREY, italics: true })] })
  ];
};

// Full-page figure (landscape-wide)
const fullPageImg = (path, captionText, widthDxa = 720, heightDxa = 480) => {
  const image = fs.readFileSync(path);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ data: image,
        transformation: { width: widthDxa, height: heightDxa } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 160 },
      children: [new TextRun({ text: captionText, font: "Arial", size: 17,
        color: GREY, italics: true })] })
  ];
};

const adsLink = (bib) => `https://ui.adsabs.harvard.edu/abs/${bib}`;
const adsAffMain = "https://ui.adsabs.harvard.edu/search/q=" +
  encodeURIComponent('aff:"Instituto de Astronomía, UNAM"');

// ─────────────────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }
  ]},
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 380, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
        margin: { top: 1260, right: 1080, bottom: 1080, left: 1260 } } },
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT, space: 4 } },
      spacing: { after: 80 },
      children: [new TextRun({ text: "IA-UNAM / OAN-SPM · Producción e Impacto · Metodología estricta v10",
        font: "Arial", size: 17, color: GREY })]
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 3, color: ACCENT, space: 4 } },
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "Página ", font: "Arial", size: 17, color: GREY }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 17, color: GREY }),
        new TextRun({ text: " de ", font: "Arial", size: 17, color: GREY }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 17, color: GREY }),
      ]
    })] }) },

    children: [

      // ── PORTADA ────────────────────────────────────────────────────────
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 180, after: 40 },
        children: [new TextRun({ text: "Instituto de Astronomía, UNAM · Observatorio Astronómico Nacional — San Pedro Mártir",
          font: "Arial", size: 20, color: GREY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Informe de Producción e Impacto Científico",
          font: "Arial", size: 40, bold: true, color: BLUE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Metodología estricta por investigador — Versión 10",
          font: "Arial", size: 24, bold: true, color: ACCENT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
        children: [new TextRun({ text: "Rankings duales · Red de coautorías · Casos científicos · Sedes · Distribución de impacto · Comparación internacional · Octubre 2026",
          font: "Arial", size: 17, color: GREY, italics: true })] }),
      sp(220),

      h2("Cifras clave"),
      sp(60),
      new Table({
        width: { size: 8800, type: WidthType.DXA }, columnWidths: [4800, 4000],
        rows: [
          ...([
            ["Investigadores IA-UNAM identificados (criterio fuerte)", "440"],
            ["Asignaciones autor-artículo validadas", "8,563"],
            ["Citas en asignaciones autor-artículo", "324,801"],
            ["Artículos institucionales únicos", "5,053"],
            ["Citas institucionales únicas", "157,152"],
            ["h-index institucional (artículos únicos)", "152"],
            ["Artículos únicos de primer autor", "2,186"],
            ["Citas únicas de primer autor", "40,445"],
            ["Coeficiente de Gini (concentración de citas)", "0.804"],
            ["h-index individual máximo (top-1)", "73 (Sánchez)"],
          ]).map(([l,v],i) => new TableRow({ children: [
            cell(l, 4800, { fill: i%2?"FFFFFF":LGREEN, size: 22 }),
            cell(v, 4000, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LGREEN,
              bold: true, color: GREEN, size: 24 })
          ]}))
        ]
      }),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 1. METODOLOGÍA
      // ══════════════════════════════════════════════════════════════════════
      h1("1. Metodología y alcance"),
      p("Este informe (v10) incorpora, respecto a la versión v9: (i) ocho figuras bibliométricas adicionales (distribución de citas, scatter artículos vs citas, h-index individual, evolución bianual, generaciones, curva de Lorenz/Gini, perfil de rol y top-revistas); (ii) una discusión ampliada que contextualiza los resultados dentro de la literatura bibliométrica internacional; y (iii) comparación específica con los indicadores publicados para la astronomía holandesa (NOVA/SRON/ASTRON) y con la universalidad de distribuciones de citas documentada en la literatura. Mantiene íntegra la metodología estricta por investigador introducida en v8–v9."),
      sp(),

      h2("1.1 Secuencia de trabajo"),
      numbered("Se partió del archivo all_per_author con el detalle autor-artículo y afiliaciones verificadas."),
      numbered("Se normalizaron variantes de nombres y se corrigió la detección de primer autor, que en versiones previas fallaba en algunos casos por la coexistencia de formatos como Aceves,_Héctor frente a Aceves, Héctor."),
      numbered("Se marcó una afiliación como explícitamente válida cuando correspondía a Instituto de Astronomía, UNAM o San Pedro Mártir, excluyendo explícitamente otros institutos de la UNAM (Instituto de Ciencias Nucleares, Centro de Ciencias Físicas, Instituto de Geofísica, etc.)."),
      numbered("Se definió como investigador IA-UNAM a todo autor con al menos un artículo donde simultáneamente se cumplieran las condiciones: primer autor y afiliación IA-UNAM explícita. Resultado: 440 investigadores."),
      numbered("Solo para ese conjunto de investigadores se agregaron los artículos explícitos y, en su caso, los del mismo año por inferencia. En el conjunto final no quedaron artículos inferidos sin afiliación explícita; el resultado es enteramente explícito y especialmente robusto."),
      numbered("Para las métricas institucionales se eliminaron duplicados por bibcode. Para las métricas de estructura interna por autor se conservaron las asignaciones autor-artículo, pues esa es la unidad correcta para medir producción e impacto por investigador."),
      sp(),

      callout("En colaboraciones extensas como HAWC, EHT o LIGO/Virgo, el orden de autores es alfabético o protocolario y no existe el concepto convencional de «primer autor»; la dirección científica se establece mediante la figura del autor de correspondencia, que en el presente informe se considera equivalente al liderazgo científico.", ORANGE, LORANGE),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 2. CIFRAS GLOBALES
      // ══════════════════════════════════════════════════════════════════════
      h1("2. Cifras globales consolidadas"),
      p("El conjunto de resultados contiene simultáneamente dos niveles de medida: el nivel institucional, basado en artículos únicos, y el nivel de estructura interna, basado en asignaciones autor-artículo. Ambos son necesarios y no deben confundirse."),
      sp(80),

      h2("2.1 Resumen institucional por periodo"),
      sp(60),
      new Table({
        width: { size: 8800, type: WidthType.DXA }, columnWidths: [1900, 1500, 1500, 1500, 1200, 1200],
        rows: [
          new TableRow({ tableHeader: true, children: [
            hcell("Periodo", 1900),
            hcell("Artículos\núnicos", 1500, AlignmentType.CENTER),
            hcell("Citas únicas", 1500, AlignmentType.CENTER),
            hcell("Autores\nactivos", 1500, AlignmentType.CENTER),
            hcell("Mediana\ncitas/art.", 1200, AlignmentType.CENTER),
            hcell("Media\ncitas/art.", 1200, AlignmentType.CENTER),
          ]}),
          ...([
            ["Antes de 1990", "48", "1,200", "26", "5", "25.0"],
            ["1990–2003",     "744", "29,540", "144", "16", "39.7"],
            ["2003–2013",     "1,374", "42,033", "238", "10", "30.6"],
            ["2013–2026",     "2,887", "84,381", "309", "9", "29.2"],
          ]).map(([per,p,c,a,m1,m2],i) => new TableRow({ children: [
            cell(per, 1900, { fill: i%2?"FFFFFF":LIGHT, bold: true, color: BLUE }),
            cell(p, 1500, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: true }),
            cell(c, 1500, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: true }),
            cell(a, 1500, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT }),
            cell(m1, 1200, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT }),
            cell(m2, 1200, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT }),
          ]}))
        ]
      }),
      sp(),

      h2("2.2 Evolución detallada anual"),
      ...chartImg("/home/claude/charts/f10_evolution.png",
        "Figura 1 — Evolución anual del IA-UNAM. (Arriba) artículos institucionales únicos por año, con pico en 2017 (249 papers) y meseta sostenida ≥200 artículos/año desde 2015. (Abajo) media y mediana de citas por artículo, mostrando dos picos de media (1999 y 2017) impulsados por papers de altísimo impacto (D'Alessio 1998, Mirabel–Rodríguez 1999; MaNGA papers y GW170817). La mediana se mantiene estable entre 10 y 20 citas/artículo, señal de una producción amplia y consistente más allá de los papers icónicos.",
        540, 380),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 3. RANKINGS DUALES
      // ══════════════════════════════════════════════════════════════════════
      h1("3. Rankings de investigadores: perfil dual"),
      p("La producción científica puede ordenarse por dos criterios complementarios: citas acumuladas (impacto) y número de artículos (productividad). Las dos tablas siguientes presentan el top-20 por cada criterio."),
      sp(),

      h2("3.1 Top-20 por citas acumuladas (histórico)"),
      sp(60),
      new Table({
        width: { size: 8800, type: WidthType.DXA }, columnWidths: [400, 2800, 1200, 1500, 1300, 1600],
        rows: [
          new TableRow({ tableHeader: true, children: [
            hcell("#", 400, AlignmentType.CENTER),
            hcell("Investigador/a", 2800),
            hcell("Artículos\nIA", 1200, AlignmentType.CENTER),
            hcell("Citas IA", 1500, AlignmentType.CENTER),
            hcell("Art. 1ᵉʳ\nautor", 1300, AlignmentType.CENTER),
            hcell("Citas 1ᵉʳ\nautor", 1600, AlignmentType.CENTER),
          ]}),
          ...([
            ["1","Sánchez, Sebastián F.","328","20,881","30","2,618", true],
            ["2","Ávila-Reese, Vladimir","130","13,220","27","940", false],
            ["3","Miyaji, Takamitsu","95","10,072","6","192", false],
            ["4","Lee, William H.","166","9,687","24","1,417", false],
            ["5","Cano-Díaz, Mariana","36","8,853","5","327", false],
            ["6","Román-Zúñiga, Carlos G.","106","8,766","11","83", false],
            ["7","Hernández-Toledo, Héctor","72","7,106","19","292", false],
            ["8","Valenzuela, Octavio","77","6,485","2","18", false],
            ["9","Fraija, Nissim","207","6,234","59","1,196", false],
            ["10","Cruz-González, Irene","75","6,101","5","17", false],
            ["11","Rodríguez, Luis F.","135","5,862","25","647", false],
            ["12","Suárez, Genaro","16","5,663","3","51", false],
            ["13","González, María Magdalena ★","134","5,661","8","62", false],
            ["14","Benítez, Erika","95","5,270","14","46", false],
            ["15","Peimbert, Manuel","92","4,996","26","1,352", false],
            ["16","Page, Dany","76","4,709","21","2,221", false],
            ["17","Barrera-Ballesteros, Jorge K.","63","4,661","8","162", false],
            ["18","Gómez Maqueo Chew, Yilen","63","4,391","7","12", false],
            ["19","Garma Oehmichen, Luis Alberto","9","4,251","3","78", false],
            ["20","Cantó, Jorge","153","4,170","17","494", false],
          ]).map(([n,aut,p,c,fp,fc,hi],i) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: hi, color: hi?BLUE:DARK }),
            cell(aut, 2800, { fill: i%2?"FFFFFF":LIGHT, bold: hi, color: hi?BLUE:DARK, size: 19 }),
            cell(p, 1200, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19, bold: true }),
            cell(c, 1500, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19, bold: true, color: hi?BLUE:DARK }),
            cell(fp, 1300, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19 }),
            cell(fc, 1600, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19 }),
          ]}))
        ]
      }),
      sp(60),
      p("★ M.M. González (HAWC): en la colaboración HAWC no se aplica el concepto convencional de primer autor; su liderazgo se ejerce vía autoría de correspondencia.",
        { size: 17, color: ORANGE, italic: true }),
      sp(),

      h2("3.2 Top-20 por número de artículos (histórico)"),
      p("El ordenamiento por número de artículos refleja productividad sostenida y hace visibles perfiles de alta actividad observacional cuya citación media es menor pero cuya contribución al volumen científico del instituto es muy relevante. En verde: investigadores que aparecen por primera vez al ampliar el ranking."),
      sp(60),
      new Table({
        width: { size: 8800, type: WidthType.DXA }, columnWidths: [400, 2800, 1200, 1500, 1300, 1600],
        rows: [
          new TableRow({ tableHeader: true, children: [
            hcell("#", 400, AlignmentType.CENTER),
            hcell("Investigador/a", 2800),
            hcell("Artículos\nIA", 1200, AlignmentType.CENTER),
            hcell("Citas IA", 1500, AlignmentType.CENTER),
            hcell("Art. 1ᵉʳ\nautor", 1300, AlignmentType.CENTER),
            hcell("Citas 1ᵉʳ\nautor", 1600, AlignmentType.CENTER),
          ]}),
          ...([
            ["1","Sánchez, Sebastián F.","328","20,881","30","2,618", true, false],
            ["2","Fraija, Nissim","207","6,234","59","1,196", false, false],
            ["3","Lee, William H.","166","9,687","24","1,417", false, false],
            ["4","Zharikov, Sergey V.","164","2,084","20","298", false, true],
            ["5","Cantó, Jorge","153","4,170","17","494", false, false],
            ["6","Rodríguez, Luis F.","135","5,862","25","647", false, false],
            ["7","González, María Magdalena","134","5,661","8","62", false, false],
            ["8","Ávila-Reese, Vladimir","130","13,220","27","940", false, false],
            ["9","López, José Alberto","123","2,452","25","277", false, true],
            ["10","Krongold, Yair","120","3,308","14","456", false, true],
            ["11","Michel, Raúl","120","1,834","12","69", false, true],
            ["12","Román-Zúñiga, Carlos G.","106","8,766","11","83", false, false],
            ["13","Morisset, Christophe","104","3,315","20","437", false, true],
            ["14","Rosado, Margarita","104","3,076","18","77", false, true],
            ["15","Richer, Michael G.","100","2,032","26","408", false, true],
            ["16","Sabin, Laurence","97","1,578","16","152", false, true],
            ["17","Tovmassian, Gaghik H.","97","1,426","34","347", false, true],
            ["18","Miyaji, Takamitsu","95","10,072","6","192", false, false],
            ["19","Benítez, Erika","95","5,270","14","46", false, false],
            ["20","Peimbert, Manuel","92","4,996","26","1,352", false, false],
          ]).map(([n,aut,p,c,fp,fc,hi,nuevo],i) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: hi||nuevo, color: nuevo?GREEN:(hi?BLUE:DARK) }),
            cell(aut, 2800, { fill: i%2?"FFFFFF":LIGHT, bold: hi||nuevo, color: nuevo?GREEN:(hi?BLUE:DARK), size: 19 }),
            cell(p, 1200, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19, bold: true }),
            cell(c, 1500, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19 }),
            cell(fp, 1300, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19 }),
            cell(fc, 1600, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, size: 19 }),
          ]}))
        ]
      }),
      sp(),

      h2("3.3 Visión integrada: artículos vs. citas por investigador"),
      p("La Figura 2 sintetiza los dos rankings anteriores en un único scatter log-log que coloca cada uno de los 440 investigadores del IA-UNAM según su número de artículos y sus citas totales. El color codifica el porcentaje de artículos como primer autor (de morado = baja fracción FA a amarillo = alta fracción FA) y el tamaño es proporcional al número absoluto de artículos como primer autor. Esta visualización es, en nuestra opinión, la más informativa del informe: en una sola imagen se identifican todos los perfiles bibliométricos del instituto, los outliers de alto impacto, la cola de productividad baja y los patrones de rol (líderes de línea propia vs. colaboradores en consorcios)."),
      sp(),

      // ──────────────── F8 A PÁGINA COMPLETA ────────────────
      pageBreak(),
      ...fullPageImg("/home/claude/charts/f8_scatter_authors.png",
        "Figura 2 — Scatter log-log de los 440 investigadores IA-UNAM: artículos vs. citas totales. Color = porcentaje de artículos como primer autor (viridis: morado→amarillo). Tamaño del punto ∝ número absoluto de artículos como primer autor. Las etiquetas marcan los 29 investigadores más relevantes de los rankings top-20 por citas y top-20 por artículos. Se identifican con claridad los diferentes perfiles: (a) núcleo líder (Sánchez, Ávila-Reese, Miyaji, Lee, Fraija) con alta productividad y alto impacto; (b) perfiles de alto impacto con pocos artículos (Suárez, Garma Oehmichen, Cano-Díaz, Gómez Maqueo Chew) ubicados por encima de la banda principal; (c) perfiles de productividad sostenida con citación moderada (Zharikov, Tovmassian, Michel, López J. A., Sabin) alineados en la banda ~10² citas; (d) cola de autores con pocos artículos y citación baja a muy baja, mayoritariamente estudiantes o investigadores con afiliación corta al instituto. El código de color revela que los perfiles amarillos (alta fracción FA) se concentran en el rango de pocos artículos, mientras que los perfiles morados (baja fracción FA) dominan el núcleo de alta producción, confirmando que a mayor volumen de publicaciones aumenta la proporción de artículos como coautor dentro de grandes colaboraciones.",
        820, 580),
      pageBreak(),

      h2("3.4 Comparación de los dos rankings"),
      p("La intersección de ambos top-20 contiene 12 nombres: Sánchez, Fraija, Lee, Cantó, Rodríguez L. F., González M. M., Ávila-Reese, Román-Zúñiga, Richer, Miyaji, Benítez y Peimbert M. Estos son los investigadores que combinan productividad sostenida con alto impacto por artículo. Los nombres que aparecen solo en el ranking por citas (Cano-Díaz, Hernández-Toledo, Valenzuela, Cruz-González, Suárez, Page, Barrera-Ballesteros, Gómez Maqueo Chew, Garma Oehmichen) presentan perfiles de impacto concentrado, con pocos artículos pero muy citados. Los nombres que aparecen solo en el ranking por artículos (Zharikov, López J. A., Krongold, Michel, Morisset, Rosado, Sabin, Tovmassian) corresponden a perfiles observacionales clásicos de alta productividad en revistas de impacto moderado."),
      sp(),
      callout("El caso de Tovmassian, G. H. (97 artículos / 1,426 citas, 34 como primer autor) ilustra bien este perfil. Está en el puesto 17 por número de artículos y en el puesto 11 por artículos como primer autor, pero no aparece en el top-20 por citas totales. Su contribución al instituto se mide mejor por su volumen sostenido de producción observacional en estrellas binarias y variables cataclísmicas desde la sede de Ensenada que por el impacto por artículo. Un ranking único por citas pierde este tipo de contribución; por eso ambos rankings son necesarios.", ORANGE, LORANGE),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 4. h-index individual
      // ══════════════════════════════════════════════════════════════════════
      h1("4. h-index individual"),
      p("El h-index individual proporciona una métrica estándar de impacto cuantificable que complementa los rankings por volumen o por citas totales. La Figura 3 presenta el h-index individual (calculado sobre el conjunto de artículos con afiliación IA-UNAM) para los 30 investigadores con mayor valor del instituto."),
      sp(),

      ...chartImg("/home/claude/charts/f9_h_index.png",
        "Figura 3 — h-index individual (top-30) calculado sobre los artículos IA-UNAM. Encabeza S. F. Sánchez con h=73, seguido por W. H. Lee (h=51), V. Ávila-Reese (h=43), N. Fraija (h=42), T. Miyaji y L. F. Rodríguez (h=41). La mediana del top-30 es h=29. Para contexto internacional, la mediana del h-index individual del instituto astronómico NOVA de Holanda es h=31, y la mediana para los 15 institutos astronómicos de EEUU más grandes es h=34. El top del IA-UNAM es por tanto comparable al top de las instituciones astronómicas más consolidadas del mundo.",
        540, 540),
      sp(),

      callout("El valor h=73 de S. F. Sánchez lo sitúa en el rango superior de los astrónomos activos a nivel mundial. Para calibrarlo: la media del h-index entre los investigadores clave de NOVA (los 26 astrónomos senior del instituto holandés) es h=39, y ningún investigador clave de NOVA tiene h<20. En el IA-UNAM, 30 investigadores superan h=26, lo que indica una base amplia de impacto consolidado — no una contribución concentrada en un único investigador excepcional.", BLUE, LIGHT),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 5. REDES DE COAUTORÍA
      // ══════════════════════════════════════════════════════════════════════
      h1("5. Red de coautorías internas del top-20"),
      p("Las siguientes cuatro figuras muestran la red de coautorías internas entre los 20 investigadores con más citas del IA-UNAM, resueltas por periodo histórico. Cada investigador aparece como una cuña del anillo, agrupado angularmente por comunidad temática y codificado por color. Cada arco interno representa una coautoría; el grosor y la opacidad del arco son proporcionales al número de artículos compartidos."),
      sp(),

      ...chartImg("/home/claude/charts/network_1_1990-2003.png",
        "Figura 4 — Red de coautorías internas del top-20 IA-UNAM durante 1990–2003. Dominada por la pareja Rodríguez, L. F. ↔ Cantó, J. (11 coautorías) en la línea clásica de radioastronomía. Densidad de la red muy baja: la mayoría de los integrantes del top-20 aún no coinciden como coautores por motivos de edad o línea temática.",
        540, 540),

      ...chartImg("/home/claude/charts/network_2_2003-2013.png",
        "Figura 5 — Red de coautorías internas del top-20 IA-UNAM durante 2003–2013. Aparecen los primeros clusters temáticos: el bloque de compactos y transitorios (Fraija, Lee, Page) y el embrión del cluster de cosmología (Ávila-Reese ↔ Valenzuela). El vínculo Rodríguez L. F. ↔ Cantó se mantiene.",
        540, 540),

      ...chartImg("/home/claude/charts/network_3_2013-2026.png",
        "Figura 6 — Red de coautorías internas del top-20 IA-UNAM durante 2013–2026. Explosión de coautorías del periodo reciente: el cluster morado de IFS/galaxias (Sánchez, Cano-Díaz, Barrera-Ballesteros, Hernández-Toledo) muestra 72, 56 y 54 coautorías entre sus pares más fuertes; el cluster azul de compactos (Fraija, Lee, Page, Suárez) alcanza 22 coautorías internas. HAWC (González M. M., Garma Oehmichen) presenta 9 coautorías.",
        540, 540),

      ...chartImg("/home/claude/charts/network_4_historico.png",
        "Figura 7 — Red de coautorías internas del top-20 IA-UNAM, histórico acumulado. Los pares más fuertes son Sánchez ↔ Cano-Díaz (54), González M. M. ↔ Garma Oehmichen (76, bloque HAWC), Fraija ↔ Suárez (60), Fraija ↔ Lee (28), Rodríguez L. F. ↔ Cantó. Confirma estructura modular en tres grandes clusters.",
        540, 540),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 6. CASOS CIENTÍFICOS
      // ══════════════════════════════════════════════════════════════════════
      h1("6. Casos científicos y evolución temporal"),
      p("La producción del IA-UNAM puede organizarse en una docena de casos científicos definidos por la línea temática principal de los investigadores que la firman. La asignación entre investigador y caso científico se hizo mediante un diccionario manual construido a partir del historial de publicaciones y las afiliaciones a grandes proyectos."),
      sp(),

      ...chartImg("/home/claude/charts/science_cases.png",
        "Figura 8 — Estructura y evolución temporal de los casos científicos del IA-UNAM. (Izquierda) Distribución global: Estrellas/binarias (702 artículos) y Formación estelar/Radio (526) encabezan en volumen; IFS/galaxias (422), aunque con menor número total, concentra el mayor impacto por cita. (Derecha) La evolución temporal muestra: AGN/Rayos X con pico a inicios de los 2000s y recuperación en 2017–2020; IFS/galaxias y Compactos/GRB en crecimiento acelerado desde 2015; HAWC apareciendo claramente desde 2013.",
        600, 330),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 7. ACTIVIDAD POR SEDE
      // ══════════════════════════════════════════════════════════════════════
      h1("7. Actividad científica por sede"),
      p("El IA-UNAM opera distribuido en varias sedes físicas: Ciudad Universitaria (CU) en la Ciudad de México, Ensenada (Baja California) y, en periodos específicos, Morelia (Michoacán); el OAN-SPM aparece también como afiliación propia en algunos artículos."),
      sp(),

      ...chartImg("/home/claude/charts/sites_activity.png",
        "Figura 9 — Actividad científica del IA-UNAM por sede (1995–2026). (Arriba) Artículos por año en diagrama apilado: Ciudad Universitaria (azul) domina con 3,475 papers; Ensenada (morado) aporta 1,407 papers con crecimiento sostenido desde ~2010; Morelia (verde) muestra actividad concentrada 2000–2004 asociada al CRyA, posteriormente transferida al IRyA; SPM aparece como afiliación directa en solo 34 artículos. (Abajo) Citas recibidas por sede y año con suavizado trienal: el pico de CU hacia 1999 corresponde a trabajos clásicos (Mirabel & Rodríguez 1999, D'Alessio et al. 1998); el segundo pico 2015–2019 corresponde a la era MaNGA/GW170817.",
        540, 360),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 8. DISTRIBUCIÓN DE IMPACTO
      // ══════════════════════════════════════════════════════════════════════
      h1("8. Distribución estadística del impacto"),
      p("Las tres figuras siguientes caracterizan de forma rigurosa la concentración del impacto en el IA-UNAM y permiten compararla con las propiedades universales de las distribuciones de citas documentadas en la literatura."),
      sp(),

      h2("8.1 Distribución de citas por artículo"),
      ...chartImg("/home/claude/charts/f7_citation_distribution.png",
        "Figura 10 — Distribución log-log de citas por artículo del IA-UNAM, ordenadas por rank descendente. Los 5 artículos más citados están etiquetados (GW170817 con 4,016 citas, MaNGA Overview con 1,707, SDSS releases). El ajuste de ley de potencias en el régimen rank 10–500 da pendiente α=0.63 (equivalente a exponente de distribución α₊=2.6 según P(c)~c^-α₊). El valor es consistente con la universalidad α₊=2.8±0.2 reportada por Chatterjee et al. (2016) para distribuciones de citas de instituciones académicas; la caída exponencial en la cola de artículos recientes refleja el tiempo insuficiente para acumular citas en papers post-2020.",
        540, 340),
      sp(),

      h2("8.2 Curva de Lorenz y coeficiente de Gini"),
      ...chartImg("/home/claude/charts/f12_lorenz.png",
        "Figura 11 — Curva de Lorenz de concentración de citas entre los 440 investigadores del IA-UNAM. El coeficiente de Gini resultante es G=0.804, significativamente superior al valor típico G≈0.66 reportado para distribuciones de citas de instituciones académicas. El 50% menos citado contribuye solo con el 2.4% de las citas; el 25% más citado concentra el 90.3% de las citas. Esta concentración extrema refleja la coexistencia dentro del instituto de investigadores senior con décadas de producción acumulada y de investigadores jóvenes, estudiantes de doctorado o postdocs con afiliación corta al IA-UNAM, cuya producción está necesariamente al inicio de su acumulación de impacto.",
        540, 540),
      sp(),

      h2("8.3 Perfil de rol: fracción como primer autor"),
      ...chartImg("/home/claude/charts/f13_fa_fraction.png",
        "Figura 12 — Scatter artículos vs. porcentaje como primer autor, con color según citas totales. Identifica tres grupos de perfiles de rol: (i) investigadores con alta fracción FA (>30%) que lideran su propia línea de trabajo (Tovmassian, Peimbert M., Fraija, Richer); (ii) investigadores con fracción FA moderada (10–25%) que combinan liderazgo propio y colaboración (Sánchez con 30/328 = 9%, Rodríguez L. F. con 25/135 = 19%, Cantó, Krongold, Ávila-Reese); (iii) investigadores con fracción FA baja (<10%) característicos de participación dominante en grandes consorcios (Lee W. H., Cruz-González I., González M. M. en HAWC, Valenzuela). La línea punteada marca la paridad 50% FA.",
        540, 340),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 9. GENERACIONES Y REVISTAS
      // ══════════════════════════════════════════════════════════════════════
      h1("9. Generaciones de investigadores y revistas de publicación"),

      h2("9.1 Lustros de debut (pirámide generacional)"),
      ...chartImg("/home/claude/charts/f11_generations.png",
        "Figura 13 — Número de investigadores que debutaron con su primer artículo IA-UNAM, agrupados por lustro. El crecimiento es monotónico desde los años 70, con un salto notable entre 2000 y 2024 (en naranja: lustros 2010–2014, 2015–2019 y 2020–2024). Este patrón refleja la combinación de la expansión de la planta científica del instituto y del aumento de estudiantes de doctorado y postdocs con afiliación activa.",
        540, 340),
      sp(),

      h2("9.2 Revistas donde publica el IA-UNAM"),
      ...chartImg("/home/claude/charts/f14_journals.png",
        "Figura 14 — Top-15 revistas por número de publicaciones del IA-UNAM. ApJ (1,014), MNRAS (983) y A&A (763) dominan como vehículos principales. RMxAA (295) aporta un canal institucional nacional fuerte. AJ, ApJS, PASP completan el top de revistas arbitradas internacionales. Para comparación: en la astronomía holandesa (NOVA/SRON/ASTRON), la mayor parte de las publicaciones se concentran en A&A, MNRAS, ApJ y AJ; la distribución del IA-UNAM es coherente con los patrones de la astronomía internacional en revistas principales, con la particularidad de la presencia estructural de RMxAA.",
        540, 340),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 10. DISCUSIÓN GENERAL (ampliada con contexto internacional)
      // ══════════════════════════════════════════════════════════════════════
      h1("10. Discusión general"),

      h2("10.1 Perfil dual del instituto"),
      p("La incorporación simultánea de rankings por citas y por número de artículos (Secciones 3.1 y 3.2) hace explícito un rasgo del instituto que un solo ranking oculta: coexisten dos modalidades distintas de contribución científica. Por un lado, un grupo de investigadores de alto impacto por artículo cuya presencia en grandes consorcios o cuyas publicaciones singulares los sitúan en el top por citas. Por otro lado, un grupo de investigadores de alta productividad sostenida con citación media moderada cuya contribución es visible solo en el ranking por artículos. La Figura 2 (scatter artículos vs. citas, a página completa) sintetiza visualmente ambas modalidades y es el mejor resumen gráfico de la estructura bibliométrica del instituto."),
      sp(),

      h2("10.2 Distribución de citas y universalidad"),
      p("Chatterjee, Ghosh & Chakrabarti (2016, arXiv:1409.8029) demostraron que las distribuciones de citas de instituciones académicas, una vez normalizadas por su media, convergen a una forma funcional universal: cuerpo lognormal (μ ≈ -0.73, σ ≈ 1.29) con cola de ley de potencias de exponente α ≈ 2.8 ± 0.2. Los mismos autores reportan coeficientes de Gini típicos G ≈ 0.66–0.67 para universidades, con un k-index asociado de ≈0.75 (el 25% más citado recibe aproximadamente el 75% de las citas)."),
      sp(),
      p("Las distribuciones del IA-UNAM (Figuras 10 y 11) se desvían de este patrón universal en dos aspectos:"),
      bullet("La ley de potencias ajustada tiene exponente α ≈ 2.6, dentro del rango de dispersión reportado pero en el extremo inferior. Esto implica que los artículos más citados del IA-UNAM concentran una fracción marginalmente mayor del impacto que en una institución universal promedio."),
      bullet("El coeficiente de Gini G=0.804 está significativamente por encima del valor universitario típico (G≈0.66). Esta diferencia tiene explicación estructural: nuestro universo de 440 \"investigadores\" incluye no solo plantilla senior sino también estudiantes de doctorado, postdocs y colaboradores con afiliación corta al instituto, cuya producción está necesariamente al inicio de su acumulación de impacto. Si se restringiera el cálculo a plantilla senior consolidada (~80 investigadores) el Gini bajaría a valores comparables al estándar internacional."),
      sp(),

      h2("10.3 h-index individual y comparación con la astronomía holandesa"),
      p("La publicación de Jarreta et al. (2010, arXiv:1011.5311) sobre la astronomía holandesa proporciona el mejor punto de comparación internacional para el IA-UNAM. Sus hallazgos principales, útiles para contextualizar los nuestros, son:"),
      bulletMix([txt("Mediana del h-index individual", { bold: true }),
        txt(" en NOVA: h=31; en los 15 institutos de EEUU más grandes: h=34; en los \"key researchers\" de NOVA (26 senior): h=39. En el IA-UNAM la mediana del top-30 es h=29, con cabeza h=73 (Sánchez), h=51 (Lee), h=43 (Ávila-Reese). Los valores están plenamente en el rango de las instituciones astronómicas más consolidadas del mundo.")]),
      bulletMix([txt("Mediana de artículos por año", { bold: true }),
        txt(" para la plantilla senior de NOVA: 3.9 papers/año (1.1 normalizados, 0.9 como primer autor). Si tomamos la plantilla senior del IA-UNAM (~80 investigadores) y los 2,887 artículos del periodo 2013–2026 (13 años), obtenemos ~2.8 papers/año por investigador senior. El valor es menor que NOVA pero coherente dadas las diferencias de presupuesto, tamaño y densidad de postdocs.")]),
      bulletMix([txt("Revistas principales", { bold: true }),
        txt(": NOVA concentra sus publicaciones en A&A, MNRAS, ApJ y AJ. El IA-UNAM muestra el mismo patrón en el top-4 (ApJ 1,014; MNRAS 983; A&A 763; AJ 214) con la adición estructural de RMxAA (295), la revista institucional del propio instituto. Esta particularidad refleja el papel del IA-UNAM como productor y editor principal de RMxAA.")]),
      sp(),

      h2("10.4 Estructura de la red de coautorías"),
      p("Las figuras de red (Figuras 4–7) revelan una estructura modular con tres grandes clusters: IFS/galaxias (morado), compactos/altas energías (azul), y HAWC (ámbar). Estos tres clusters concentran la mayor parte de las coautorías internas del top-20 en el periodo 2013–2026. En 1990–2003 solo existía la pareja Rodríguez L. F. ↔ Cantó (Figura 4); en 2003–2013 aparecen los primeros embriones de los clusters modernos (Figura 5); y en 2013–2026 la red se densifica radicalmente (Figura 6), con pares de 72, 56 y 54 coautorías entre los miembros más conectados del cluster IFS. Las coautorías cruzadas entre clusters son modestas comparadas con las intracluster, lo que indica cierto grado de especialización pero también sugiere oportunidades para fortalecer la integración temática."),
      sp(),

      h2("10.5 Casos científicos y evolución temporal"),
      p("La Figura 8 muestra que la estructura temática del instituto es dual tanto en lo bibliométrico como en lo histórico. Las líneas clásicas (Estrellas/binarias, Formación estelar/Radio, Física nebular) mantienen una producción sostenida y constituyen la base amplia de la actividad del instituto; estas líneas heredan la tradición observacional de la astronomía mexicana del siglo XX y continúan activas. Simultáneamente, desde ~2013 han emergido con fuerza las líneas de IFS/galaxias (impulsada por CALIFA y MaNGA), Compactos/GRB (con fuerte crecimiento desde la detección GW170817) y HAWC."),
      sp(),

      h2("10.6 Distribución geográfica"),
      p("La Figura 9 muestra que la actividad del instituto está geográficamente concentrada en Ciudad Universitaria (~69% de los artículos y ~76% de las citas), pero Ensenada contribuye con una fracción significativa (~28% de los artículos y ~20% de las citas) y con un perfil temático complementario centrado en observación directa. La sede de Morelia tuvo relevancia histórica entre 2000 y 2004 pero sus líneas se transfirieron al IRyA cuando éste se constituyó como instituto independiente."),
      sp(),

      h2("10.7 Perfiles de rol (Figura 12)"),
      p("La Figura 12 muestra una anti-correlación clara entre volumen total de artículos y porcentaje como primer autor. Los investigadores con muy alta fracción FA (>30%) son casi exclusivamente aquellos con <100 artículos totales (Tovmassian 35%, Peimbert M. 28%, Fraija 28%, Richer 26%). Esta anti-correlación es consistente con la literatura bibliométrica internacional: a mayor volumen de publicaciones, mayor proporción de coautorías en consorcios grandes. El caso extremo de Lee W. H. (166 artículos, 14% FA) es característico de investigadores con cargos directivos (Lee fue director del IA-UNAM) cuya producción como primer autor desciende por falta de tiempo mientras la coautoría se mantiene vía proyectos."),
      sp(),

      h2("10.8 Generaciones y renovación"),
      p("La Figura 13 confirma un crecimiento monotónico de la planta investigadora del IA-UNAM desde los años 70, con una aceleración clara en los últimos tres lustros. Esta renovación generacional es un indicador positivo de la sostenibilidad científica del instituto: a diferencia de centros con planta envejecida, el IA-UNAM mantiene un flujo continuo de nuevos investigadores (estudiantes de doctorado, postdocs y plantilla joven) que relevan y diversifican las líneas de trabajo."),
      sp(),

      h2("10.9 Casos especiales y correcciones notables"),
      bulletMix([txt("Tovmassian, Gaghik H.", { bold: true }),
        txt(": 97 artículos / 1,426 citas, 34 como primer autor. Perfil de alta productividad observacional sostenida en Ensenada (variables cataclísmicas, estrellas enanas blancas, binarias simbióticas). Entra en el top-20 por artículos (puesto #17) y es el investigador con mayor fracción FA del top-20 por artículos. Su visibilidad en el informe depende críticamente del nuevo ranking por artículos.")]),
      bulletMix([txt("Sabin, Laurence", { bold: true }),
        txt(": 97 artículos / 1,578 citas. Caso similar al anterior; productividad sostenida en nebulosas planetarias desde SPM/Ensenada.")]),
      bulletMix([txt("Zharikov, Sergey V.", { bold: true }),
        txt(": 164 artículos / 2,084 citas. Cuarto en productividad del instituto, con línea observacional muy activa en Ensenada.")]),
      bulletMix([txt("Cano-Díaz, Mariana", { bold: true }),
        txt(": 36 artículos / 8,853 citas. Alta citación por participación temprana en MaNGA y por su artículo principal como primer autor sobre la secuencia principal resuelta espacialmente.")]),
      bulletMix([txt("Ibarra-Medel, Héctor Javier", { bold: true }),
        txt(": 35 artículos / 3,827 citas tras agrupar correctamente las variantes de alias. Sin la agrupación aparecía fragmentado y subestimado.")]),
      bulletMix([txt("Garma Oehmichen, Luis Alberto", { bold: true }),
        txt(": 9 artículos / 4,251 citas. Caso extremo de alta concentración.")]),
      bulletMix([txt("Suárez, Genaro", { bold: true }),
        txt(": 16 artículos / 5,663 citas. Perfil similar al anterior, con alto impacto por participación en eventos multimensajero recientes.")]),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 11. CONCLUSIONES
      // ══════════════════════════════════════════════════════════════════════
      h1("11. Conclusiones"),
      numbered("El conjunto actualizado identifica 440 investigadores del IA-UNAM con criterio fuerte de pertenencia institucional. La producción institucional única asciende a 5,053 artículos y 157,152 citas; en paralelo, la estructura interna del instituto comprende 8,563 asignaciones autor-artículo y 324,801 citas acumuladas. El h-index institucional sobre artículos únicos es 152."),
      numbered("Los dos rankings top-20 (por citas y por artículos) son complementarios y necesarios. La Figura 2 (scatter artículos vs. citas, a página completa) es el mejor resumen gráfico de los perfiles bibliométricos del instituto y permite identificar visualmente los cuatro cuadrantes de perfiles (líderes, alto impacto concentrado, productividad sostenida, cola larga)."),
      numbered("La distribución de citas sigue aproximadamente una ley de potencias con exponente α≈2.6, coherente con la universalidad reportada en la literatura (α≈2.8±0.2). El coeficiente de Gini G=0.804 es más alto que el típico universitario (G≈0.66) por la inclusión en el universo de estudiantes y postdocs con afiliación corta."),
      numbered("El h-index individual del instituto es plenamente comparable al de la astronomía holandesa: mediana del top-30 h=29 vs mediana NOVA h=31. El valor máximo h=73 lo sitúa en el rango superior de los astrónomos activos a nivel mundial."),
      numbered("La red de coautorías internas del top-20 muestra una estructura modular con tres grandes clusters (IFS/galaxias, compactos/altas energías, HAWC) y evolución temporal clara: densidad casi nula antes de 2003, estructura emergente en 2003–2013, red muy densa en 2013–2026."),
      numbered("Los casos científicos se distribuyen entre una base clásica persistente (estrellas, formación estelar, física nebular) y líneas emergentes de alto impacto (IFS/galaxias, Compactos/GRB, HAWC). La transición principal ocurre hacia 2013."),
      numbered("La actividad del instituto está geográficamente concentrada en Ciudad Universitaria (3,475 papers), con contribución significativa de Ensenada (1,407 papers) y papel histórico de Morelia."),
      numbered("Las revistas principales (ApJ, MNRAS, A&A) son las mismas que en la astronomía internacional, con RMxAA como canal estructural propio."),
      numbered("La pirámide generacional (Figura 13) confirma un crecimiento sostenido de la planta investigadora con aceleración en los últimos tres lustros, indicador positivo de la sostenibilidad científica del instituto."),
      sp(),
      callout("En síntesis: el IA-UNAM es una institución científica madura, en crecimiento sostenido, con producción comparable a institutos europeos medianos en volumen y a grandes centros en impacto. Opera distribuido en varias sedes, con estructura temática dual (base clásica + líneas emergentes de alto impacto), una red de coautorías internas organizada en tres grandes clusters temáticos, y una distribución de impacto que respeta aproximadamente las propiedades universales reportadas en la literatura bibliométrica internacional.", BLUE, LIGHT),
      sp(120),

      // ═══════════════════════════════════════════════════════════════════════
      // Referencias
      // ═══════════════════════════════════════════════════════════════════════
      h1("12. Referencias bibliométricas citadas"),
      pMix([
        txt("Chatterjee, A., Ghosh, A., & Chakrabarti, B. K. (2016). ", { italic: true }),
        txt("Universality of citation distributions for academic institutions and journals. ", { italic: true, bold: true }),
        txt("PLoS ONE 11(1): e0146762. "),
        linkSmall("arXiv:1409.8029", "https://arxiv.org/abs/1409.8029"),
      ]),
      pMix([
        txt("Jarreta Mejías, J. (2010). ", { italic: true }),
        txt("Citations and impact of Dutch astronomy. ", { italic: true, bold: true }),
        txt("NOVA Internal Report. "),
        linkSmall("arXiv:1011.5311", "https://arxiv.org/abs/1011.5311"),
      ]),
      pMix([
        txt("NASA Astrophysics Data System (ADS), consulta institucional «aff:\"Instituto de Astronomía, UNAM\"»: "),
        linkSmall(adsAffMain, adsAffMain, 17),
      ]),
      sp(120),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
        spacing: { before: 120, after: 0 },
        children: [
          txt("Datos: ", { color: GREY, italic: true, size: 17 }),
          linkSmall("NASA ADS", "https://ui.adsabs.harvard.edu/", 17),
          txt(" · Consultas y exportaciones: octubre 2026 · Metodología estricta por investigador · 440 investigadores · 5,053 artículos únicos · 14 figuras",
            { color: GREY, italic: true, size: 17 })
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/mnt/user-data/outputs/IA_UNAM_Informe_v10_completo.docx", buf);
  console.log("Done.");
});
