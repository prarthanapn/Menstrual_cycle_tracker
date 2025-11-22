import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Generate a professional PDF report
export const generatePDFReport = (user, cycles, symptoms, summary, filepath) => {
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.join(__dirname, '../', filepath);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(fullPath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('Menstrual Health Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(1);

      // User Profile Section
      doc.fontSize(14).font('Helvetica-Bold').text('User Profile');
      doc.fontSize(11).font('Helvetica');
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      if (user.age_group) doc.text(`Age Group: ${user.age_group}`);
      if (user.blood_group) doc.text(`Blood Group: ${user.blood_group}`);
      if (user.height_cm) doc.text(`Height: ${user.height_cm} cm`);
      if (user.weight_kg) doc.text(`Weight: ${user.weight_kg} kg`);
      doc.moveDown(1);

      // Cycle Summary
      if (cycles.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Recent Cycles');
        doc.fontSize(10).font('Helvetica');

        // Table headers
        const tableTop = doc.y;
        doc.text('Start Date', 50);
        doc.text('End Date', 130);
        doc.text('Length', 210);
        doc.text('Flow', 260);
        doc.text('Pain', 310);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table rows (last 6 cycles)
        cycles.slice(0, 6).forEach((cycle) => {
          const y = doc.y + 5;
          doc.text(cycle.start_date, 50);
          doc.text(cycle.end_date || 'N/A', 130);
          doc.text(`${cycle.cycle_length || '-'} days`, 210);
          doc.text(cycle.flow_level || '-', 260);
          doc.text(`${cycle.pain_level || '-'}/10`, 310);
          doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        });

        doc.moveDown(1);
      }

      // Statistics
      if (cycles.length > 0) {
        const avgLength = Math.round(cycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cycles.length);
        doc.fontSize(12).font('Helvetica-Bold').text('Statistics');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Average Cycle Length: ${avgLength} days`);

        const flowCounts = {};
        cycles.forEach(c => {
          flowCounts[c.flow_level] = (flowCounts[c.flow_level] || 0) + 1;
        });
        doc.text(`Flow Distribution: ${Object.entries(flowCounts).map(([k, v]) => `${k}(${v})`).join(', ')}`);

        doc.moveDown(1);
      }

      // Common Symptoms
      if (symptoms.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('Symptom Summary');
        doc.fontSize(10).font('Helvetica');

        const symptomCounts = {};
        symptoms.forEach(s => {
          if (s.mood) symptomCounts[`Mood: ${s.mood}`] = (symptomCounts[`Mood: ${s.mood}`] || 0) + 1;
          if (s.cramps) symptomCounts['Cramps'] = (symptomCounts['Cramps'] || 0) + 1;
          if (s.headache) symptomCounts['Headache'] = (symptomCounts['Headache'] || 0) + 1;
          if (s.bloating) symptomCounts['Bloating'] = (symptomCounts['Bloating'] || 0) + 1;
          if (s.nausea) symptomCounts['Nausea'] = (symptomCounts['Nausea'] || 0) + 1;
        });

        Object.entries(symptomCounts).forEach(([symptom, count]) => {
          doc.text(`• ${symptom}: ${count} occurrences`);
        });

        doc.moveDown(1);
      }

      // AI Summary
      doc.fontSize(12).font('Helvetica-Bold').text('Health Insights');
      doc.fontSize(10).font('Helvetica').text(summary, { align: 'left', width: 450 });
      doc.moveDown(1);

      // Footer
      doc.fontSize(9).font('Helvetica').text(
        'This report is for informational purposes only. Consult a healthcare professional for medical advice.',
        { align: 'center' }
      );

      doc.end();

      stream.on('finish', () => {
        console.log(`✅ PDF generated: ${filepath}`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};
