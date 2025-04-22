const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://swqmlmrxaiesskxahzjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cW1sbXJ4YWllc3NreGFoempuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzEyNTAsImV4cCI6MjA2MDc0NzI1MH0.d1gCibKEqldG7wqklutWBUlx8sQ2kz3yuVGG1VBMa60';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
