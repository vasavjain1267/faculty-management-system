// components/pdf/AnnexureHPassportPDF.tsx

import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"

type Props = {
  data: Record<string, string>
}

/* ======================================================
   STYLES
   ====================================================== */
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 45,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },

  annexure: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  toSection: {
    marginBottom: 20,
    fontSize: 10,
    lineHeight: 1.4,
  },

  subject: {
    marginBottom: 16,
    fontWeight: "bold",
  },

  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
  },

  salutation: {
    marginTop: 20,
    marginBottom: 40,
  },

  signaturesSection: {
    marginTop: 30,
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  signatureBox: {
    width: "48%",
  },

  label: {
    fontWeight: "bold",
    fontSize: 10,
  },

  line: {
    marginTop: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },

  detailsSection: {
    marginTop: 20,
  },

  detailRow: {
    marginBottom: 8,
    fontSize: 10,
  },

  note: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 9,
    lineHeight: 1.4,
  },

  placeDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 10,
  },
})

/* ======================================================
   COMPONENT
   ====================================================== */
export default function AnnexureHPassportPDF({ data }: Props) {
  const {
    place = "",
    date = "",
    passportOffice = "Bhopal",
    employeeName = "",
    dateOfBirth = "",
    designation = "",
    officeWorking = "",
    presentOfficeAddress = "",
    residentialAddress = "",
    employeeSignature = "",
    employerSignature = "",
  } = data

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= TITLE ================= */}
        <Text style={styles.annexure}>ANNEXURE 'H'</Text>
        
        <Text style={styles.subtitle}>
          PRIOR INTIMATION (PI) LETTER FROM THE GOVERNMENT/PSU/STATUTORY BODY EMPLOYEE{"\n"}
          TO HIS/HER ADMINISTRATIVE OFFICE FOR SUBMISSION OF PASSPORT{"\n"}
          APPLICATION FOR HIMSELF/HERSELF{"\n"}
          (ON PLAIN PAPER)
        </Text>

        {/* ================= PLACE & DATE ================= */}
        <View style={styles.placeDate}>
          <Text>Place: {place}</Text>
          <Text>Date: {formatDate(date)}</Text>
        </View>

        {/* ================= TO SECTION ================= */}
        <View style={styles.toSection}>
          <Text>Assistant Registrar, Faculty Affairs</Text>
          <Text>Indian Institute of Technology Indore</Text>
          <Text>Simrol, Khandwa Road, Indore-453552</Text>
          <Text>Madhya Pradesh, India</Text>
          <Text>Office: 0731-660-3509 (Ext. No. 3509)</Text>
          <Text>Email-id: arfacultyaffairs@iiti.ac.in</Text>
        </View>

        {/* ================= SUBJECT ================= */}
        <Text style={styles.subject}>
          Subject: Prior Intimation for Submission of Passport Application.
        </Text>

        {/* ================= SALUTATION ================= */}
        <Text style={styles.paragraph}>Sir/Madam,</Text>

        {/* ================= MAIN CONTENT ================= */}
        <Text style={styles.paragraph}>
          I hereby give prior intimation that I am applying for an ordinary Passport to Regional Passport Office, {passportOffice}.
        </Text>

        <Text style={styles.paragraph}>
          This is for your kind information and record.
        </Text>

        {/* ================= CLOSING ================= */}
        <Text style={styles.salutation}>Yours faithfully,</Text>

        {/* ================= SIGNATURES SECTION ================= */}
        <View style={styles.signaturesSection}>
          <View style={styles.signatureRow}>
            {/* Employer Signature */}
            <View style={styles.signatureBox}>
              <Text style={styles.label}>Employer Signature:</Text>
              {employerSignature ? (
                <Image
                  src={employerSignature}
                  style={{ marginTop: 8, width: 100, height: 35 }}
                />
              ) : (
                <View style={styles.line} />
              )}
            </View>

            {/* Employee Signature */}
            <View style={styles.signatureBox}>
              <Text style={styles.label}>Signature:</Text>
              {employeeSignature ? (
                <Image
                  src={employeeSignature}
                  style={{ marginTop: 8, width: 100, height: 35 }}
                />
              ) : (
                <View style={styles.line} />
              )}
            </View>
          </View>

          <View style={styles.signatureRow}>
            {/* Employer Office Seal */}
            <View style={styles.signatureBox}>
              <Text style={styles.label}>Employer Office Seal:</Text>
              <View style={styles.line} />
            </View>

            {/* Employee Name */}
            <View style={styles.signatureBox}>
              <Text style={styles.label}>Name:</Text>
              <Text style={{ marginTop: 4 }}>{employeeName}</Text>
            </View>
          </View>
        </View>

        {/* ================= EMPLOYEE DETAILS ================= */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text>{formatDate(dateOfBirth)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Designation:</Text>
            <Text>{designation}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Name of Office Where Working:</Text>
            <Text>{officeWorking}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Name of Organization:</Text>
            <Text>Indian Institute Of Technology Indore</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Address of Present Office:</Text>
            <Text>{presentOfficeAddress || "___________________"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Residential Address:</Text>
            <Text>{residentialAddress || "___________________"}</Text>
          </View>
        </View>

        {/* ================= NOTE ================= */}
        <View style={styles.note}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Note:</Text>
          <Text>
            The Prior Intimation Letter (under this Annexure) shall be accepted by the Passport Authority 
            for processing the passport application if the same bears the signature and seal of the employer 
            of the applicant acknowledging its receipt.
          </Text>
        </View>
      </Page>
    </Document>
  )
}