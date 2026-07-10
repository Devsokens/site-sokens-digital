import { Injectable } from '@nestjs/common';
const vCardsJS = require('vcards-js');
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CardsService {
  private supabase;

  constructor() {
    // In a real app, these would come from ConfigService
    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async generateVCard(id: string): Promise<string> {
    const { data: employee, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !employee) {
      throw new Error('Employee not found');
    }

    // Create a new vCard
    const vCard = vCardsJS();

    // Set properties
    vCard.firstName = employee.first_name;
    vCard.lastName = employee.last_name;
    vCard.organization = 'Sokens Digital';
    vCard.title = employee.role;
    
    if (employee.email) {
      vCard.email = employee.email;
    }
    
    if (employee.phone) {
      vCard.workPhone = employee.phone;
    }
    
    if (employee.linkedin_url) {
      vCard.socialUrls['linkedIn'] = employee.linkedin_url;
    }
    
    vCard.url = 'https://sokens.digital';

    return vCard.getFormattedString();
  }
}
