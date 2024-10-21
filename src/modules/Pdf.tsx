import fontkit from "@pdf-lib/fontkit";
import { PDFDocument } from "pdf-lib";

export const pdfGen = async () => {
  const fontUrl = "https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf";
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  // const { selectedBrand } = useAppContext(); //Get selected brand

  const formUrl = "/media/pdf/avis.pdf";
  // selectedBrand === BrandOptions.Avis
  //   ? "/media/pdf/avis.pdf"
  //   : "/media/pdf/budget.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);
  // const form = pdfDoc.getForm();
  const page1 = pdfDoc.getPage(0);
  // const page3 = pdfDoc.getPage(2);
  const firstDonorPdfDoc = await PDFDocument.load(formPdfBytes);
  const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [2]);
  // pdfDoc.insertPage(3, firstDonorPage)

  page1.drawText("Ahmet Emin Şit", {
    font: customFont,
    size: 11,
    x: 216,
    y: 136,
  });
  page1.drawText("05454422723", {
    size: 11,
    x: 400,
    y: 136,
  });
  page1.drawText("ahmetemins@otokoc.com.tr", {
    font: customFont,
    size: 11,
    x: 90,
    y: 104,
  });
  // gsm.setText('5454857596')
  // name.setText("Ahmet Emin Sit")
  // email.setText('ahmetemins@otokoc')

  // gsm.addToPage(page1, {
  //     x: 390,
  //     y: 128,
  //     width: 70,
  //     height: 25,
  //     borderWidth: 0,
  //     textColor: rgb(0, 0, 0)
  // });
  // name.addToPage(page1, {
  //     x: 210,
  //     y: 128,
  //     width: 90,
  //     height: 25,
  //     borderWidth: 0,
  //     backgroundColor: rgb(1, 1, 1),
  //     textColor: rgb(0, 0, 0)
  // });
  // email.addToPage(page1, {
  //     x: 80,
  //     y: 94,
  //     width: 140,
  //     height: 25,
  //     borderWidth: 0,
  //     backgroundColor: rgb(1, 1, 1),
  //     textColor: rgb(0, 0, 0)
  // });

  const { width, height } = page1.getSize();
  const margin = 22;
  const tableWidth = width - 2 * margin;
  const yStart = height - 250;

  const table = [
    [
      "MARKA",
      "MODEL",
      "SÜRE",
      "AYLIK KM LİMİTİ",
      "KİRA",
      "LİMİT AŞIM",
      "FİYAT SEVİYESİ",
    ],
    ["a", "Camry", "36 ay", "20,000 km", "2,500 TL", "0.25 TL/km", "Orta"],
    ["b", "Accord", "24 ay", "15,000 km", "2,200 TL", "0.20 TL/km", "Ekonomik"],
    ["c", "Focus", "48 ay", "25,000 km", "2,800 TL", "0.30 TL/km", "Yüksek"],
    ["d", "Altima", "36 ay", "18,000 km", "2,400 TL", "0.22 TL/km", "Orta"],
    ["e", "Malibu", "24 ay", "12,000 km", "2,100 TL", "0.18 TL/km", "Ekonomik"],
    ["f", "3 Series", "48 ay", "22,000 km", "3,200 TL", "0.28 TL/km", "Yüksek"],
    ["g", "C-Class", "36 ay", "24,000 km", "3,000 TL", "0.26 TL/km", "Orta"],
    ["h", "A4", "24 ay", "20,000 km", "2,900 TL", "0.25 TL/km", "Ekonomik"],
    ["i", "Sonata", "48 ay", "28,000 km", "2,600 TL", "0.32 TL/km", "Yüksek"],
    ["j", "Passat", "36 ay", "21,000 km", "2,700 TL", "0.23 TL/km", "Orta"],
    ["k", "6", "24 ay", "16,000 km", "2,300 TL", "0.19 TL/km", "Ekonomik"],
    ["l", "Optima", "48 ay", "26,000 km", "2,750 TL", "0.29 TL/km", "Yüksek"],
    ["m", "Legacy", "36 ay", "19,000 km", "2,450 TL", "0.21 TL/km", "Orta"],
    ["n", "ES", "24 ay", "14,000 km", "2,150 TL", "0.17 TL/km", "Ekonomik"],
    ["o", "Q50", "48 ay", "23,000 km", "3,100 TL", "0.31 TL/km", "Yüksek"],
    ["p", "TLX", "36 ay", "17,000 km", "2,350 TL", "0.24 TL/km", "Orta"],
    ["q", "300", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Ekonomik"],
    ["r", "XE", "48 ay", "27,000 km", "3,300 TL", "0.34 TL/km", "Yüksek"],
    ["s", "MKZ", "36 ay", "20,000 km", "2,850 TL", "0.27 TL/km", "Orta"],
    ["t", "S60", "24 ay", "15,000 km", "2,400 TL", "0.20 TL/km", "Ekonomik"],
    ["u", "300", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Ekonomik"],
    // ["v", "Passat", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Yüksek"],
    // ["o", "Q50", "48 ay", "23,000 km", "3,100 TL", "0.31 TL/km", "Yüksek"],
    // ["p", "TLX", "36 ay", "17,000 km", "2,350 TL", "0.24 TL/km", "Orta"],
    // ["q", "300", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Ekonomik"],
    // ["r", "XE", "48 ay", "27,000 km", "3,300 TL", "0.34 TL/km", "Yüksek"],
    // ["s", "MKZ", "36 ay", "20,000 km", "2,850 TL", "0.27 TL/km", "Orta"],
    // ["t", "S60", "24 ay", "15,000 km", "2,400 TL", "0.20 TL/km", "Ekonomik"],
    // ["u", "300", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Ekonomik"],
    // ["v", "Passat", "24 ay", "13,000 km", "2,250 TL", "0.16 TL/km", "Yüksek"],
  ];

  function paginateData(data: string[][], pageSize: number): string[][][] {
    const paginatedData: string[][][] = [];
    const totalRows = data.length;

    for (let i = 1; i < totalRows; i += pageSize) {
      const page = data.slice(i, i + pageSize);
      paginatedData.push(page);
    }

    return paginatedData;
  }

  const pageSize = 10;
  const paginatedTable = paginateData(table, pageSize);

  console.log("Paginated data: ", paginatedTable);

  const cellMargin = 0;
  const yPosition = yStart - cellMargin;
  const columnWidths = table[0].map(() => tableWidth / table[0].length);

  //   page3.drawText("Avis Teklif Dökümani", { x: margin, y: yPosition });

  paginatedTable.map((res, index) => {
    // console.log(`Response - ${index}: `, res);
    debugger;
    if (index !== 0) {
      pdfDoc.insertPage(index + 2, firstDonorPage);
    }

    const headerRow = table[0];
    for (let j = 0; j < headerRow.length; j++) {
      const headerCell = headerRow[j];
      const headerCellWidth = columnWidths[j];
      const xPosition = margin + j * headerCellWidth;

      pdfDoc.getPage(index + 2).drawText(headerCell, {
        font: customFont,
        size: 8,
        x: xPosition + cellMargin,
        y: yPosition + 15,
      });
    }

    for (let i = 0; i < res.length; i++) {
      const row = res[i];
      const rowHeight = 20;
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const cellWidth = columnWidths[j];
        const xPosition = margin + j * cellWidth;
        pdfDoc.getPage(index + 2).drawText(cell, {
          font: customFont,
          size: 8,
          x: xPosition + cellMargin,
          y: yPosition - i * rowHeight,
        });
      }
    }
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  //link.download = "Avis Teklif Dokumanı - Ahmet Emin Sit.pdf";
  link.click();
};
