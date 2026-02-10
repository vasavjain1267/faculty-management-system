// components/pdf/AnnexureGNocPassportPDF.tsx

import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

export type AnnexureGNocPassportPDFProps = {
  data: Record<string, string>
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 45,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },

  refLeft: {
    fontSize: 11,
  },

  dateRight: {
    fontSize: 11,
    textAlign: "right",
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 20,
  },

  annexureHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  para: {
    marginBottom: 12,
    textAlign: "justify",
    lineHeight: 1.6,
  },

  bold: {
    fontWeight: "bold",
  },

  footer: {
    marginTop: 40,
  },

  signature: {
    width: 120,
    height: 40,
    marginTop: 8,
    marginBottom: 8,
  },

  contactInfo: {
    fontSize: 10,
    marginTop: 2,
  },

  photoBox: {
    width: 130,
    height: 160,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
    textAlign: "center",
    padding: 6,
  },
})

export default function AnnexureGNocPassportPDF({ data }: AnnexureGNocPassportPDFProps) {
  const {
    refNo = "",
    issueDate = "",
    facultyName = "",
    fatherName = "",
    doj = "",
    department = "",
    passportNumber = "",
    applicantPhoto = "",
    signature = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER WITH REF NO, DATE & PHOTO ================= */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 25 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.refLeft}>{refNo}</Text>
            <Text style={styles.dateRight}>{issueDate}</Text>
          </View>

          {/* Photo Box */}
          <View style={styles.photoBox}>
            {applicantPhoto ? (
              <Image src={applicantPhoto} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text>
                Applicant's photo to be attested by Certifying authority
              </Text>
            )}
          </View>
        </View>

        {/* ================= ANNEXURE TITLE ================= */}
        <Text style={styles.annexureHeader}>ANNEXURE 'G'</Text>

        {/* ================= MAIN TITLE ================= */}
        <Text style={styles.title}>NO OBJECTION CERTIFICATE</Text>

        {/* ================= CONTENT ================= */}
        <Text style={styles.para}>
          <Text style={styles.bold}>{facultyName}</Text>, Son of{" "}
          <Text style={styles.bold}>{fatherName}</Text>, who is an Indian
          national, is employed at the Indian Institute of Technology (IIT)
          Indore, Madhya Pradesh, India, since{" "}
          <Text style={styles.bold}>{doj}</Text>, as an Assistant Professor in
          the Department of <Text style={styles.bold}>{department}</Text>.
        </Text>

        <Text style={styles.para}>
          This organization has no objection to the renewal of his Indian
          Passport no. <Text style={styles.bold}>{passportNumber}</Text>.
        </Text>

        <Text style={styles.para}>
          This NOC will be valid for six months from the date of issue.
        </Text>

        {/* ================= FOOTER WITH SIGNATURE ================= */}
        <View style={styles.footer}>
          {signature && <Image src={signature} style={styles.signature} />}

          <Text style={styles.contactInfo}>Assistant Registrar, Faculty Affairs</Text>
          <Text style={styles.contactInfo}>Indian Institute of Technology Indore</Text>
          <Text style={styles.contactInfo}>Simrol, Khandwa Road, Indore-453552</Text>
          <Text style={styles.contactInfo}>Madhya Pradesh, India</Text>
          <Text style={styles.contactInfo}>Office: 0731-660-3509 (Ext. No. 3509)</Text>
          <Text style={styles.contactInfo}>Email-id: arfacultyaffairs@iiti.ac.in</Text>
        </View>
      </Page>
    </Document>
  )
}
