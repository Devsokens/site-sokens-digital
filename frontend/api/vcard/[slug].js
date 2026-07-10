const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    res.status(400).send('Missing slug');
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !employee) {
    res.status(404).send('Employee not found');
    return;
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${employee.last_name};${employee.first_name};;;`,
    `FN:${employee.first_name} ${employee.last_name}`,
    'ORG:Sokens Digital',
    `TITLE:${employee.role || ''}`,
  ];
  if (employee.email) lines.push(`EMAIL:${employee.email}`);
  if (employee.phone) lines.push(`TEL;TYPE=WORK,VOICE:${employee.phone}`);
  if (employee.address) lines.push(`ADR;TYPE=WORK:;;${employee.address};;;;`);
  if (employee.linkedin_url) lines.push(`URL;TYPE=LinkedIn:${employee.linkedin_url}`);
  lines.push('URL:https://sokens.digital', 'END:VCARD');

  const vcard = lines.join('\r\n');
  const filename = `${employee.first_name}-${employee.last_name}.vcf`.toLowerCase();

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(vcard);
};
