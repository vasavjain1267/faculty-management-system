
import type { FormTemplate } from "./types"
import { bonafideTemplate } from "./templates/bonafide"
import { rdRequestTemplate } from "./templates/rd-request"
import { undertakingNocPassportTemplate } from "./templates/undertaking-noc-passport"
import { ltcOfficeMemorandumTemplate } from "./templates/ltc-office-memorandum"
import { addressProofTemplate } from "./templates/address-proof"
import { serviceCertificateKVTemplate } from "./templates/service-certificate-kv"
import { annexureAPassportTemplate } from "./templates/annexure-a-passport"

export const formTemplates = {
  bonafide: bonafideTemplate,
  "rd-request": rdRequestTemplate,
 "undertaking-noc-passport": undertakingNocPassportTemplate,
 "ltc-office-memorandum": ltcOfficeMemorandumTemplate,
 "address-proof": addressProofTemplate,
 "service-certificate-kv": serviceCertificateKVTemplate,
 "annexure-a-passport": annexureAPassportTemplate,
}

