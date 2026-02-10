
import type { FormTemplate } from "./types"
import { bonafideTemplate } from "./templates/bonafide"
import { undertakingNocPassportTemplate } from "./templates/undertaking-noc-passport"
import { ltcOfficeMemorandumTemplate } from "./templates/ltc-office-memorandum"
import { addressProofTemplate } from "./templates/address-proof"
import { serviceCertificateKVTemplate } from "./templates/service-certificate-kv"
import { annexureAPassportTemplate } from "./templates/annexure-a-passport"
import { annexureGNocPassportTemplate } from "./templates/annexure-g-noc-passport"
import { nocVisaTemplate } from "./templates/noc-visa"
import { annexureHPassportTemplate } from "./templates/annexure-h-passport"

export const formTemplates = {
  bonafide: bonafideTemplate,
 "undertaking-noc-passport": undertakingNocPassportTemplate,
 "ltc-office-memorandum": ltcOfficeMemorandumTemplate,
 "address-proof": addressProofTemplate,
 "service-certificate-kv": serviceCertificateKVTemplate,
 "annexure-a-passport": annexureAPassportTemplate,
 "annexure-g-noc-passport": annexureGNocPassportTemplate,
 "noc-visa": nocVisaTemplate,
 "annexure-h-passport": annexureHPassportTemplate,
}

