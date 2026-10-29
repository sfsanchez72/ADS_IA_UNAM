const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer, VerticalAlign,
  ImageRun, ExternalHyperlink
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
        margin: { top: 1440, right: 1260, bottom: 1260, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT, space: 4 } },
      spacing: { after: 80 },
      children: [new TextRun({ text: "IA-UNAM / OAN-SPM · Producción e Impacto · Metodología estricta v9",
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
        children: [new TextRun({ text: "Metodología estricta por investigador — Versión 9",
          font: "Arial", size: 24, bold: true, color: ACCENT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
        children: [new TextRun({ text: "Rankings top-20 duales · Red de coautorías · Casos científicos · Actividad por sede · Octubre 2026",
          font: "Arial", size: 18, color: GREY, italics: true })] }),
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
      p("Este informe (v9) extiende la versión v8 incorporando dos tablas de ranking complementarias (top-20 por citas y top-20 por número de artículos), nuevas figuras publicables sobre redes de coautoría, casos científicos y actividad por sede, y una discusión ampliada que integra todos estos elementos. Mantiene íntegra la metodología estricta por investigador introducida en v8."),
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
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 3. RANKINGS DUALES
      // ══════════════════════════════════════════════════════════════════════
      h1("3. Rankings de investigadores: perfil dual"),
      p("La producción científica puede ordenarse por dos criterios complementarios: citas acumuladas (impacto) y número de artículos (productividad). Las dos tablas siguientes presentan el top-20 por cada criterio. La comparación entre ambas revela perfiles bibliométricos muy distintos entre los investigadores del instituto."),
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
      p("El ordenamiento por número de artículos refleja productividad sostenida y hace visibles perfiles de alta actividad observacional cuya citación media es menor pero cuya contribución al volumen científico del instituto es muy relevante. Varios de estos nombres no aparecían en el top-20 por citas y han sido explícitamente recuperados para esta versión del informe."),
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
            ["4","Zharikov, Sergey V.","164","2,084","20","298", false, false],
            ["5","Cantó, Jorge","153","4,170","17","494", false, false],
            ["6","Rodríguez, Luis F.","135","5,862","25","647", false, false],
            ["7","González, María Magdalena","134","5,661","8","62", false, false],
            ["8","Ávila-Reese, Vladimir","130","13,220","27","940", false, false],
            ["9","López, José Alberto","123","2,452","25","277", false, false],
            ["10","Krongold, Yair","120","3,308","14","456", false, false],
            ["11","Michel, Raúl","120","1,834","12","69", false, false],
            ["12","Román-Zúñiga, Carlos G.","106","8,766","11","83", false, false],
            ["13","Morisset, Christophe","104","3,315","20","437", false, false],
            ["14","Rosado, Margarita","104","3,076","18","77", false, false],
            ["15","Richer, Michael G.","100","2,032","26","408", false, false],
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
      sp(60),
      p("En verde: investigadores que aparecen en el top-20 por artículos pero no en el top-20 por citas (recuperados en v9). Sabin, L. y Tovmassian, G. H. son dos ejemplos canónicos de perfil de alta productividad sostenida en observación de nebulosas planetarias y estrellas variables / cataclísmicas respectivamente, con citación media moderada (~15–16 citas/artículo).",
        { size: 17, color: GREEN, italic: true }),
      sp(),

      h2("3.3 Comparación de los dos rankings"),
      p("La interseccción de ambos top-20 contiene 12 nombres: Sánchez, Fraija, Lee, Cantó, Rodríguez L. F., González M. M., Ávila-Reese, Román-Zúñiga, Richer, Miyaji, Benítez y Peimbert M. Estos son los investigadores que combinan productividad sostenida con alto impacto por artículo. Los nombres que aparecen solo en el ranking por citas (Cano-Díaz, Hernández-Toledo, Valenzuela, Cruz-González, Suárez, Page, Barrera-Ballesteros, Gómez Maqueo Chew, Garma Oehmichen) presentan perfiles de impacto concentrado, con pocos artículos pero muy citados — típicamente por participación en grandes consorcios o descubrimientos puntuales de alto impacto. Los nombres que aparecen solo en el ranking por artículos (Zharikov, López J. A., Krongold, Michel, Morisset, Rosado, Sabin, Tovmassian) corresponden a perfiles observacionales clásicos de alta productividad en revistas de impacto moderado."),
      sp(),
      callout("El caso de Tovmassian, G. H. (97 artículos / 1,426 citas, 34 como primer autor) ilustra bien este perfil. Está en el puesto 17 por número de artículos y en el puesto 11 por artículos como primer autor, pero no aparece en el top-20 por citas totales. Su contribución al instituto se mide mejor por su volumen sostenido de producción observacional en estrellas binarias y variables cataclísmicas desde la sede de Ensenada que por el impacto por artículo. Un ranking único por citas pierde este tipo de contribución; por eso ambos rankings son necesarios.", ORANGE, LORANGE),
      sp(),

      h2("3.4 Concentración acumulada del impacto"),
      sp(60),
      new Table({
        width: { size: 8800, type: WidthType.DXA }, columnWidths: [3000, 2900, 2900],
        rows: [
          new TableRow({ tableHeader: true, children: [
            hcell("Top N investigadores", 3000),
            hcell("% citas acumuladas", 2900, AlignmentType.CENTER),
            hcell("% artículos acumulados", 2900, AlignmentType.CENTER),
          ]}),
          ...([
            ["Top-10",  "30.0%", "15.1%"],
            ["Top-20",  "45.3%", "24.9%"],
            ["Top-50",  "72.1%", "47.5%"],
            ["Top-100", "88.8%", "72.9%"],
          ]).map(([n,c,p],i) => new TableRow({ children: [
            cell(n, 3000, { fill: i%2?"FFFFFF":LIGHT, bold: true, color: BLUE }),
            cell(c, 2900, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: true, color: ACCENT, size: 22 }),
            cell(p, 2900, { align: AlignmentType.CENTER, fill: i%2?"FFFFFF":LIGHT, bold: true, color: ACCENT, size: 22 }),
          ]}))
        ]
      }),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 4. REDES DE COAUTORÍA
      // ══════════════════════════════════════════════════════════════════════
      h1("4. Red de coautorías internas del top-20"),
      p("Las siguientes cuatro figuras muestran la red de coautorías internas entre los 20 investigadores con más citas del IA-UNAM, resueltas por periodo histórico. Cada investigador aparece como una cuña del anillo, agrupado angularmente por comunidad temática y codificado por color (IFS/galaxias en morado, cosmología en naranja, compactos/GRB en azul, HAWC en ámbar, nebulosa en verde, formación estelar en rojo, estrellas/binarias en turquesa, cúmulos en verde-azul). Cada arco interno representa una coautoría; el grosor y la opacidad del arco son proporcionales al número de artículos compartidos. Los cinco pares más fuertes de cada periodo están etiquetados con el número exacto de coautorías."),
      sp(),

      ...chartImg("/home/claude/charts/network_1_1990-2003.png",
        "Figura 1 — Red de coautorías internas del top-20 IA-UNAM durante 1990–2003. El periodo está dominado por una única pareja activa en el top-20: Rodríguez, L. F. ↔ Cantó, J. (11 coautorías) en la línea clásica de radioastronomía y jets. El resto de los investigadores del top-20 no coinciden aún como coautores por motivos de edad o línea temática. La densidad de la red es muy baja, consistente con un instituto todavía en consolidación.",
        540, 540),

      ...chartImg("/home/claude/charts/network_2_2003-2013.png",
        "Figura 2 — Red de coautorías internas del top-20 IA-UNAM durante 2003–2013. Aparecen los primeros clusters temáticos: el bloque de compactos y transitorios de alta energía (Fraija, Lee, Page) y el embrión del cluster de cosmología (Ávila-Reese ↔ Valenzuela). El vínculo entre Rodríguez L. F. y Cantó se mantiene (4 coautorías adicionales). La densidad de la red todavía es moderada.",
        540, 540),

      ...chartImg("/home/claude/charts/network_3_2013-2026.png",
        "Figura 3 — Red de coautorías internas del top-20 IA-UNAM durante 2013–2026. La explosión de coautorías del periodo reciente es evidente: el cluster morado de IFS/galaxias (Sánchez, Cano-Díaz, Barrera-Ballesteros, Hernández-Toledo) muestra 72, 56 y 54 coautorías entre sus pares más fuertes; el cluster azul de compactos (Fraija, Lee, Page, Suárez) alcanza 22 coautorías internas. HAWC (González M. M., Garma Oehmichen) presenta 9 coautorías. La red tiene además arcos interclusterales grises que corresponden a colaboraciones puntuales entre comunidades temáticas distintas.",
        540, 540),

      ...chartImg("/home/claude/charts/network_4_historico.png",
        "Figura 4 — Red de coautorías internas del top-20 IA-UNAM, histórico acumulado. Los pares más fuertes de todo el periodo son Sánchez ↔ Cano-Díaz (54), Sánchez ↔ Barrera-Ballesteros, González M. M. ↔ Garma Oehmichen (76, bloque HAWC), Fraija ↔ Suárez (60), Fraija ↔ Lee (28), y Rodríguez L. F. ↔ Cantó (línea clásica de radio). La vista acumulada confirma la estructura modular del instituto: tres grandes clusters (IFS, compactos, HAWC) con vínculos cruzados moderados.",
        540, 540),
      sp(),

      callout("La estructura de la red confirma la lectura cualitativa del instituto: tres núcleos muy conectados internamente (IFS, compactos de alta energía, HAWC) que concentran gran parte de las coautorías del periodo reciente, más una serie de líneas tradicionales que mantienen densidades menores pero sostenidas. Las coautorías cruzadas entre clusters son menos abundantes de lo que cabría esperar en un instituto grande, lo que sugiere oportunidades para una mayor integración temática entre comunidades.", BLUE, LIGHT),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 5. CASOS CIENTÍFICOS
      // ══════════════════════════════════════════════════════════════════════
      h1("5. Casos científicos y evolución temporal"),
      p("La producción del IA-UNAM puede organizarse en una docena de casos científicos definidos por la línea temática principal de los investigadores que la firman. La asignación entre investigador y caso científico se hizo mediante un diccionario manual construido a partir del historial de publicaciones y las afiliaciones a grandes proyectos; algunos investigadores con producción transversal pueden aparecer en más de un caso científico. La Figura 5 muestra, a la izquierda, la distribución global de artículos entre los once casos científicos principales (el tamaño de cada cuña del anillo es proporcional al número de artículos) y, a la derecha, la evolución temporal de cada caso científico mediante un promedio móvil de 5 años."),
      sp(),

      ...chartImg("/home/claude/charts/science_cases.png",
        "Figura 5 — Estructura y evolución temporal de los casos científicos del IA-UNAM. (Izquierda) Distribución global: Estrellas/binarias (702 artículos) y Formación estelar/Radio (526) encabezan en volumen histórico; IFS/galaxias (422), aunque con menor número total de artículos, concentra el mayor impacto por cita (26,629 citas acumuladas). Los arcos grises conectan casos científicos que comparten investigadores con producción transversal. (Derecha) La evolución temporal muestra: AGN/Rayos X con pico a inicios de los 2000s y recuperación en 2017–2020; Formación estelar/Radio y Física nebular en meseta sostenida; IFS/galaxias y Compactos/GRB en crecimiento acelerado desde 2015; HAWC apareciendo claramente desde 2013; Estrellas/binarias con un pico 2017–2019 impulsado por sinergias entre fotometría de SPM y surveys internacionales.",
        600, 330),
      sp(),

      callout("La distribución de casos científicos revela la doble naturaleza del instituto: una base amplia y persistente de astronomía observacional clásica (estrellas, nebulosas, formación estelar) heredada de la tradición mexicana en el OAN, y un conjunto de líneas emergentes de alto impacto (IFS, compactos, HAWC) que han transformado el perfil bibliométrico del instituto en la última década. La transición entre ambas se identifica con claridad en la Figura 5 derecha a partir de ~2013.", GREEN, LGREEN),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 6. ACTIVIDAD POR SEDE
      // ══════════════════════════════════════════════════════════════════════
      h1("6. Actividad científica por sede"),
      p("El IA-UNAM opera distribuido en varias sedes físicas: Ciudad Universitaria (CU) en la Ciudad de México, Ensenada (Baja California) y, en periodos específicos, Morelia (Michoacán); el OAN-SPM aparece también como afiliación propia en algunos artículos. La asignación por sede se realizó analizando los campos de afiliación de cada artículo mediante códigos postales (01000, 70-264 para CU; 22800, 22860 para Ensenada; 58089, 58090 para Morelia) y menciones textuales específicas (San Pedro Mártir, OAN-SPM, Ciudad Universitaria, etc.). Un mismo artículo puede estar asignado a más de una sede si varios de sus autores IA-UNAM declaran afiliaciones distintas."),
      sp(),

      ...chartImg("/home/claude/charts/sites_activity.png",
        "Figura 6 — Actividad científica del IA-UNAM por sede (1995–2026). (Arriba) Artículos por año en diagrama apilado: Ciudad Universitaria (azul) domina en volumen con 3,475 papers; Ensenada (morado) aporta 1,407 papers con crecimiento sostenido desde ~2010; Morelia (verde) muestra actividad concentrada entre 2000–2004 asociada al CRyA, posteriormente transferida al nuevo IRyA de la UNAM; SPM aparece como afiliación directa en solo 34 artículos, ya que la gran mayoría de los trabajos observacionales de SPM se firman desde CU o Ensenada. (Abajo) Citas recibidas por sede y año, con suavizado trienal: el pico de CU hacia 1999 corresponde a trabajos clásicos como Mirabel & Rodríguez (ARA&A 1999 sobre microquasares) y D'Alessio et al. (1998) sobre discos protoplanetarios; el segundo pico 2015–2019 corresponde a la era MaNGA/GW170817/MaNGA DR papers; Ensenada muestra un segundo pico 2015–2020 por su integración en SDSS-IV.",
        540, 360),
      sp(),

      callout("La distribución espacial del instituto refleja una historia de descentralización institucional: desde 1998 Ensenada se consolidó como segunda sede operativa y aporta hoy el ~29% de los artículos; Morelia tuvo un rol relevante entre 2000 y 2004 que después se transfirió al IRyA cuando éste se constituyó como instituto independiente. La sede CU mantiene el liderazgo tanto en volumen como en impacto absoluto, pero Ensenada contribuye con proporcionalmente mayor impacto por artículo en el periodo 2015–2020 por su integración en SDSS-IV.", BLUE, LIGHT),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 7. DISCUSIÓN AMPLIADA
      // ══════════════════════════════════════════════════════════════════════
      h1("7. Discusión general"),

      h2("7.1 Perfil dual del instituto"),
      p("La incorporación simultánea de rankings por citas y por número de artículos (Secciones 3.1 y 3.2) hace explícito un rasgo del instituto que un solo ranking oculta: coexisten dos modalidades distintas de contribución científica. Por un lado, un grupo de investigadores de alto impacto por artículo cuya presencia en grandes consorcios o cuyas publicaciones singulares de alto impacto los sitúan en el top por citas (Cano-Díaz, Hernández-Toledo, Garma Oehmichen, Suárez, Gómez Maqueo Chew, Valenzuela). Por otro lado, un grupo de investigadores de alta productividad sostenida con citación media moderada (Zharikov, López J. A., Michel, Rosado, Sabin, Tovmassian) cuya contribución es visible solo en el ranking por artículos. Un informe institucional honesto necesita reconocer ambas modalidades como contribuciones legítimas; medir todo con el mismo criterio distorsiona la realidad del instituto."),
      sp(),

      h2("7.2 Estructura de la red de coautorías"),
      p("Las figuras de red (Figuras 1–4) revelan una estructura modular con tres grandes clusters: IFS/galaxias (morado), compactos/altas energías (azul), y HAWC (ámbar). Estos tres clusters concentran la mayor parte de las coautorías internas del top-20 en el periodo 2013–2026 y muestran una evolución clara: en 1990–2003 solo existía la pareja Rodríguez L. F. ↔ Cantó (Figura 1); en 2003–2013 aparecen los primeros embriones de los clusters modernos (Figura 2); y en 2013–2026 la red se densifica radicalmente (Figura 3), con pares de 72, 56 y 54 coautorías entre los miembros más conectados del cluster IFS. Las coautorías cruzadas entre clusters son modestas comparadas con las intracluster, lo que indica cierto grado de especialización pero también sugiere oportunidades para fortalecer la integración temática."),
      sp(),

      h2("7.3 Casos científicos y evolución temporal"),
      p("La Figura 5 muestra que la estructura temática del instituto es dual tanto en lo bibliométrico como en lo histórico. Las líneas clásicas (Estrellas/binarias, Formación estelar/Radio, Física nebular) mantienen una producción sostenida y constituyen la base amplia de la actividad del instituto; estas líneas heredan la tradición observacional de la astronomía mexicana del siglo XX y continúan activas. Simultáneamente, desde ~2013 han emergido con fuerza las líneas de IFS/galaxias (impulsada por CALIFA y MaNGA), Compactos/GRB (con fuerte crecimiento desde la detección GW170817) y HAWC (que empieza a producir desde la puesta en marcha del observatorio). Esta transición ha diversificado el perfil del instituto y lo ha integrado en los grandes consorcios internacionales de la astronomía contemporánea."),
      sp(),

      h2("7.4 Distribución geográfica"),
      p("La Figura 6 muestra que la actividad del instituto está geográficamente concentrada en Ciudad Universitaria (~69% de los artículos y ~76% de las citas), pero Ensenada contribuye con una fracción significativa (~28% de los artículos y ~20% de las citas) y con un perfil temático complementario centrado en observación directa (SPM, variables, binarias cataclísmicas). La sede de Morelia tuvo relevancia histórica entre 2000 y 2004 pero sus líneas se transfirieron al IRyA cuando éste se constituyó como instituto independiente. SPM aparece como afiliación directa de solo 34 artículos porque la mayor parte de los trabajos basados en el OAN se firman desde CU o Ensenada; una contabilidad por uso del telescopio daría cifras muy superiores."),
      sp(),

      h2("7.5 Casos especiales y correcciones notables (actualizados en v9)"),
      bulletMix([txt("Tovmassian, Gaghik H.", { bold: true }),
        txt(": 97 artículos / 1,426 citas, 34 como primer autor. Perfil de alta productividad observacional sostenida en Ensenada (variables cataclísmicas, estrellas enanas blancas, binarias simbióticas). Entra en el top-20 por artículos (puesto #17) y debería ser visibilizado explícitamente en informes institucionales a pesar de no entrar en el top-20 por citas.")]),
      bulletMix([txt("Sabin, Laurence", { bold: true }),
        txt(": 97 artículos / 1,578 citas. Caso similar al anterior; productividad sostenida en nebulosas planetarias desde SPM/Ensenada. Entra en el top-20 por artículos (puesto #16).")]),
      bulletMix([txt("Zharikov, Sergey V.", { bold: true }),
        txt(": 164 artículos / 2,084 citas. Cuarto en productividad del instituto, con línea observacional muy activa en Ensenada; perfectamente visible en el ranking por artículos (puesto #4).")]),
      bulletMix([txt("Cano-Díaz, Mariana", { bold: true }),
        txt(": 36 artículos / 8,853 citas. Puesto #5 en el ranking por citas; su alta citación proviene de su participación temprana en MaNGA y de su artículo principal como primer autor sobre la secuencia principal de formación estelar resuelta espacialmente (327 citas).")]),
      bulletMix([txt("Ibarra-Medel, Héctor Javier", { bold: true }),
        txt(": 35 artículos / 3,827 citas tras agrupar correctamente las variantes de alias (Ibarra-Medel, H. e Ibarra-Medel, Héctor J.). Puesto #24 en el ranking por citas; sin la agrupación aparecía fragmentado y subestimado.")]),
      bulletMix([txt("Garma Oehmichen, Luis Alberto", { bold: true }),
        txt(": 9 artículos / 4,251 citas. Caso extremo de alta concentración: su presencia en papers HAWC y en GW170817 lo sitúa en el top-20 por citas con muy pocos artículos.")]),
      bulletMix([txt("Suárez, Genaro", { bold: true }),
        txt(": 16 artículos / 5,663 citas. Perfil similar al anterior, con alto impacto por participación en eventos multimensajero recientes.")]),
      sp(),

      h2("7.6 Comparación entre periodos"),
      p("La media de citas por artículo es máxima en 1990–2003 (39.7), reflejando que aquellos artículos han tenido más tiempo de acumular citas y que muchos son trabajos seminales (D'Alessio 1998, Mirabel-Rodríguez 1999). El periodo 2003–2013 baja a 30.6 citas/artículo y 2013–2026 a 29.2, valores que aún son muy altos para artículos relativamente jóvenes y que continuarán creciendo. El número de investigadores activos crece de forma sostenida: 26 → 144 → 238 → 309, lo que indica una institución en crecimiento y diversificación temática."),
      sp(200),

      // ══════════════════════════════════════════════════════════════════════
      // 8. CONCLUSIONES
      // ══════════════════════════════════════════════════════════════════════
      h1("8. Conclusiones"),
      numbered("El conjunto actualizado identifica 440 investigadores del IA-UNAM con criterio fuerte de pertenencia institucional. La producción institucional única asciende a 5,053 artículos y 157,152 citas; en paralelo, la estructura interna del instituto comprende 8,563 asignaciones autor-artículo y 324,801 citas acumuladas."),
      numbered("Los dos rankings top-20 (por citas y por artículos) son complementarios y necesarios: la intersección de 12 nombres identifica los investigadores que combinan productividad e impacto; los nombres exclusivos de cada ranking identifican perfiles de impacto concentrado y de productividad sostenida, respectivamente. Ambos perfiles son contribuciones legítimas al instituto."),
      numbered("La red de coautorías internas del top-20 muestra una estructura modular con tres grandes clusters (IFS/galaxias, compactos/altas energías, HAWC) y evolución temporal clara: densidad casi nula antes de 2003, estructura emergente en 2003–2013, red muy densa en 2013–2026."),
      numbered("Los casos científicos se distribuyen entre una base clásica persistente (estrellas, formación estelar, física nebular) y líneas emergentes de alto impacto (IFS/galaxias, Compactos/GRB, HAWC). La transición principal ocurre hacia 2013."),
      numbered("La actividad del instituto está geográficamente concentrada en Ciudad Universitaria (3,475 papers), con contribución significativa de Ensenada (1,407 papers) y papel histórico de Morelia (126 papers, 2000–2004). SPM aparece como afiliación directa solo en 34 papers por convenciones institucionales de firma."),
      numbered("Casos como Tovmassian, Sabin, Zharikov, Michel y López J. A. ilustran que el instituto depende también de líneas observacionales clásicas de alta productividad sostenida que no aparecen en un ranking exclusivamente por citas. Estos perfiles han sido explícitamente visibilizados en v9 mediante el nuevo ranking por número de artículos."),
      sp(),
      callout("En síntesis: el IA-UNAM es una institución científica madura, en crecimiento sostenido, con producción comparable a institutos europeos medianos en volumen y a grandes centros en impacto. Opera distribuido en varias sedes, con estructura temática dual (base clásica + líneas emergentes de alto impacto) y una red de coautorías internas organizada en tres grandes clusters temáticos. La metodología estricta por investigador y los rankings duales de v9 proporcionan la primera medición rigurosa y defendible del impacto individual de sus 440 investigadores históricos.", BLUE, LIGHT),
      sp(120),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
        spacing: { before: 120, after: 0 },
        children: [
          txt("Datos: ", { color: GREY, italic: true, size: 17 }),
          linkSmall("NASA ADS", "https://ui.adsabs.harvard.edu/", 17),
          txt(" · Consultas y exportaciones: octubre 2026 · Metodología estricta por investigador · 440 investigadores · 5,053 artículos únicos institucionales · Figuras generadas con los scripts del Anexo",
            { color: GREY, italic: true, size: 17 })
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/mnt/user-data/outputs/IA_UNAM_Informe_v9_dual_rankings.docx", buf);
  console.log("Done.");
});
