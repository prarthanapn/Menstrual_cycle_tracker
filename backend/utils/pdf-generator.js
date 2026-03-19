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
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const stream = fs.createWriteStream(fullPath);

      doc.pipe(stream);

      // Color scheme
      const primaryColor = '#E63E9C'; // Magenta
      const secondaryColor = '#7C3AED'; // Purple
      const lightGray = '#F3F4F6';
      const darkGray = '#374151';

      // === HEADER ===
      doc.fontSize(24).font('Helvetica-Bold').fillColor(primaryColor)
        .text('Menstrual Health Report', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica').fillColor(darkGray)
        .text(`Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
      doc.moveDown(0.5);

      // Divider line
      doc.strokeColor(primaryColor).lineWidth(2).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      // === USER PROFILE SECTION ===
      doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('User Profile');
      doc.moveDown(0.3);
      doc.rect(40, doc.y, 510, 100).fillAndStroke(lightGray, '#E5E7EB');
      doc.fontSize(11).font('Helvetica').fillColor(darkGray);
      
      const profileY = doc.y + 8;
      doc.text(`Name: ${user.name}`, 50, profileY);
      doc.text(`Email: ${user.email}`, 50, profileY + 18);
      doc.text(`Age Group: ${user.age_group || 'N/A'}`, 50, profileY + 36);
      doc.text(`Blood Group: ${user.blood_group || 'N/A'}`, 50, profileY + 54);
      doc.text(`Height: ${user.height_cm || 'N/A'} cm  |  Weight: ${user.weight_kg || 'N/A'} kg`, 50, profileY + 72);
      
      doc.y = profileY + 100;
      doc.moveDown(0.5);

      // === RECENT CYCLES SECTION ===
      if (cycles.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Recent Cycles');
        doc.moveDown(0.5);

        // Table setup
        const tableX = 45;
        const rowHeight = 22;
        const colWidths = { date: 95, end: 95, length: 60, flow: 70, pain: 65, status: 70 };
        const totalWidth = Object.values(colWidths).reduce((a, b) => a + b);

        // Helper function to draw a table row
        const drawTableRow = (data, bgColor, isHeader = false) => {
          const currentY = doc.y;
          const rowData = [
            { text: data[0], width: colWidths.date, x: tableX },
            { text: data[1], width: colWidths.end, x: tableX + colWidths.date },
            { text: data[2], width: colWidths.length, x: tableX + colWidths.date + colWidths.end },
            { text: data[3], width: colWidths.flow, x: tableX + colWidths.date + colWidths.end + colWidths.length },
            { text: data[4], width: colWidths.pain, x: tableX + colWidths.date + colWidths.end + colWidths.length + colWidths.flow },
            { text: data[5], width: colWidths.status, x: tableX + colWidths.date + colWidths.end + colWidths.length + colWidths.flow + colWidths.pain }
          ];

          // Draw background rectangle
          doc.rect(tableX, currentY, totalWidth, rowHeight).fill(bgColor).stroke();

          // Draw text
          if (isHeader) {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('white');
          } else {
            doc.fontSize(9).font('Helvetica').fillColor(darkGray);
          }

          rowData.forEach(cell => {
            doc.text(cell.text, cell.x + 3, currentY + 5, { width: cell.width - 6, align: 'left' });
          });

          // Draw vertical lines
          doc.strokeColor('#D1D5DB').lineWidth(0.5);
          let xPos = tableX + colWidths.date;
          for (let i = 1; i < 6; i++) {
            doc.moveTo(xPos, currentY).lineTo(xPos, currentY + rowHeight).stroke();
            xPos += Object.values(colWidths)[i];
          }

          doc.y = currentY + rowHeight;
        };

        // Draw header
        drawTableRow(['Start Date', 'End Date', 'Length', 'Flow', 'Pain', 'Status'], primaryColor, true);

        // Draw rows for last 5 cycles
        const displayCycles = cycles.slice(0, 5);
        displayCycles.forEach((cycle, idx) => {
          const bgColor = idx % 2 === 0 ? 'white' : lightGray;
          const startDate = new Date(cycle.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
          const endDate = cycle.end_date ? new Date(cycle.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '-';
          const length = `${cycle.cycle_length || '-'} d`;
          const flow = cycle.flow_level || '-';
          const pain = cycle.pain_level ? `${cycle.pain_level}/10` : '-';
          const status = cycle.end_date ? 'Done' : 'Active';

          drawTableRow([startDate, endDate, length, flow, pain, status], bgColor, false);
        });

        doc.moveDown(0.9);
      }

      // === STATISTICS SECTION ===
      if (cycles.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Cycle Statistics', { align: 'left' });
        doc.moveDown(0.4);

        const avgLength = Math.round(cycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cycles.length);
        const minLength = Math.min(...cycles.map(c => c.cycle_length || 0));
        const maxLength = Math.max(...cycles.map(c => c.cycle_length || 0));

        const flowCounts = {};
        cycles.forEach(c => {
          if (c.flow_level) flowCounts[c.flow_level] = (flowCounts[c.flow_level] || 0) + 1;
        });

        const painLevels = cycles.filter(c => c.pain_level).map(c => c.pain_level);
        const avgPain = painLevels.length > 0 ? (painLevels.reduce((a, b) => a + b, 0) / painLevels.length).toFixed(1) : 'N/A';

        // Draw stats in a box
        doc.rect(40, doc.y, 510, 78).fillAndStroke(lightGray, '#E5E7EB');
        doc.fontSize(10).font('Helvetica').fillColor(darkGray);
        
        const statsY = doc.y + 8;
        doc.text(`Average Cycle Length: ${avgLength} days (Min: ${minLength}, Max: ${maxLength})`, 50, statsY);
        doc.text(`Most Common Flow: ${Object.entries(flowCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}`, 50, statsY + 18);
        doc.text(`Average Pain Level: ${avgPain}/10`, 50, statsY + 36);
        doc.text(`Total Cycles Tracked: ${cycles.length}`, 50, statsY + 54);
        
        doc.y = statsY + 78;
        doc.moveDown(0.5);
      }

      // === SYMPTOMS SECTION ===
      if (symptoms.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Symptom Summary');
        doc.moveDown(0.4);

        const symptomCounts = {};
        symptoms.forEach(s => {
          if (s.cramps) symptomCounts['Cramps'] = (symptomCounts['Cramps'] || 0) + 1;
          if (s.headache) symptomCounts['Headache'] = (symptomCounts['Headache'] || 0) + 1;
          if (s.bloating) symptomCounts['Bloating'] = (symptomCounts['Bloating'] || 0) + 1;
          if (s.nausea) symptomCounts['Nausea'] = (symptomCounts['Nausea'] || 0) + 1;
          if (s.fatigue) symptomCounts['Fatigue'] = (symptomCounts['Fatigue'] || 0) + 1;
          if (s.mood_change) symptomCounts['Mood Changes'] = (symptomCounts['Mood Changes'] || 0) + 1;
          if (s.acne) symptomCounts['Acne'] = (symptomCounts['Acne'] || 0) + 1;
        });

        doc.fontSize(11).font('Helvetica').fillColor(darkGray);
        Object.entries(symptomCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .forEach(([symptom, count]) => {
            const percentage = Math.round((count / symptoms.length) * 100);
            doc.text(`• ${symptom}: ${count} occurrences (${percentage}%)`, 50);
          });
        doc.moveDown(0.8);
      }

      // === HEALTH INSIGHTS SECTION ===
      doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Health Insights');
      doc.moveDown(0.3);
      doc.rect(40, doc.y, 510, 60).fillAndStroke(lightGray, '#E5E7EB');
      doc.fontSize(11).font('Helvetica').fillColor(darkGray)
        .text(summary || 'No specific insights available yet. Continue tracking for personalized recommendations.', 50, doc.y + 8, { width: 490, align: 'left' });
      doc.y += 65;

      // === FOOTER ===
      doc.moveDown(0.5);
      doc.strokeColor('#D1D5DB').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(9).font('Helvetica').fillColor('#6B7280').text(
        'This report is for informational purposes only. For medical advice, consult a healthcare professional.',
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
