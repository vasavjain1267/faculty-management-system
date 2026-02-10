// Export all form templates
import { bonafideTemplate } from './templates/bonafide'
import { addressProofTemplate } from './templates/address-proof'
import { annexureAPassportTemplate } from './templates/annexure-a-passport'
import { annexureGNocPassportTemplate } from './templates/annexure-g-noc-passport'
import { annexureHPassportTemplate } from './templates/annexure-h-passport'
import { ltcOfficeMemorandumTemplate } from './templates/ltc-office-memorandum'
import { nocVisaTemplate } from './templates/noc-visa'
import { serviceCertificateKVTemplate } from './templates/service-certificate-kv'
import { undertakingNocPassportTemplate } from './templates/undertaking-noc-passport'

export const formTemplates = {
  'bonafide': bonafideTemplate,
  'address-proof': addressProofTemplate,
  'annexure-a-passport': annexureAPassportTemplate,
  'annexure-g-noc-passport': annexureGNocPassportTemplate,
  'annexure-h-passport': annexureHPassportTemplate,
  'ltc-office-memorandum': ltcOfficeMemorandumTemplate,
  'noc-visa': nocVisaTemplate,
  'service-certificate-kv': serviceCertificateKVTemplate,
  'undertaking-noc-passport': undertakingNocPassportTemplate,
}

export type FormTemplateId = keyof typeof formTemplates
