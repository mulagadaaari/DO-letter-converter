// A tiny, dependency-free DOCX builder. It creates a standards-compliant ZIP with WordprocessingML.
const encoder = new TextEncoder();
const xml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const crc32 = bytes => { let crc = -1; for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1)); } return (crc ^ -1) >>> 0; };
const u16 = (arr, n) => arr.push(n & 255, n >>> 8 & 255);
const u32 = (arr, n) => arr.push(n & 255, n >>> 8 & 255, n >>> 16 & 255, n >>> 24 & 255);

function zip(files) {
  const out = [], central = []; let offset = 0;
  files.forEach(([name, content]) => {
    const filename = encoder.encode(name), data = encoder.encode(content), crc = crc32(data);
    const local = []; u32(local, 0x04034b50); u16(local, 20); u16(local, 0); u16(local, 0); u16(local, 0); u16(local, 0); u32(local, crc); u32(local, data.length); u32(local, data.length); u16(local, filename.length); u16(local, 0);
    out.push(...local, ...filename, ...data);
    const cd = []; u32(cd, 0x02014b50); u16(cd, 20); u16(cd, 20); u16(cd, 0); u16(cd, 0); u16(cd, 0); u16(cd, 0); u32(cd, crc); u32(cd, data.length); u32(cd, data.length); u16(cd, filename.length); u16(cd, 0); u16(cd, 0); u16(cd, 0); u16(cd, 0); u32(cd, 0); u32(cd, offset);
    central.push(...cd, ...filename); offset += local.length + filename.length + data.length;
  });
  const end = []; u32(end, 0x06054b50); u16(end, 0); u16(end, 0); u16(end, files.length); u16(end, files.length); u32(end, central.length); u32(end, offset); u16(end, 0);
  return new Uint8Array([...out, ...central, ...end]);
}

export function downloadDocx(text) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean).map(p => `<w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t xml:space="preserve">${xml(p.replace(/\n/g, ' '))}</w:t></w:r></w:p>`).join('');
  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`;
  const data = zip([
    ['[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', docXml]
  ]);
  const url = URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'Demi-Official-Letter.docx' }); link.click(); URL.revokeObjectURL(url);
}

