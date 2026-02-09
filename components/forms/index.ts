
import type { FormTemplate } from "./types"
import { bonafideTemplate } from "./templates/bonafide"
import { rdRequestTemplate } from "./templates/rd-request"
import { undertakingNocPassportTemplate } from "./templates/undertaking-noc-passport"

export const formTemplates = {
  bonafide: bonafideTemplate,
  "rd-request": rdRequestTemplate,
 "undertaking-noc-passport": undertakingNocPassportTemplate,
}

