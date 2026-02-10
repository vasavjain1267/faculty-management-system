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
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 18,
  },

  para: {
    marginBottom: 10,
    textAlign: "justify",
  },

  bold: {
    fontWeight: "bold",
  },

  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  photoBox: {
    width: 130,
    height: 160,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    fontSize: 9,
    textAlign: "center",
    padding: 6,
  },

  footer: {
    marginTop: 30,
  },

  signature: {
    width: 120,
    height: 40,
    marginTop: 8,
  },
})

/* ======================================================
   COMPONENT
   ====================================================== */
export default function AnnexureAPassportPDF({ data }: Props) {
  const {
    facultyName = "",
    fatherName = "",
    doj = "",
    department = "",
    currentDesignation = "",
    currentDesignationDate = "",
    dependentName = "",
    idCardNumber = "",
    refNo = "",
    issueDate = "",
    signature = "",
    applicantPhoto = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.bold}>ANNEXURE ‘A’</Text>
        </View>

        <Text style={styles.title}>IDENTITY CERTIFICATE</Text>

        {/* ================= CONTENT ================= */}
        <Text style={styles.para}>
          Certified that <Text style={styles.bold}>{facultyName}</Text>, Son of{" "}
          <Text style={styles.bold}>{fatherName}</Text>, who is an Indian
          national, is employed at the Indian Institute of Technology (IIT)
          Indore, Madhya Pradesh, India, since{" "}
          <Text style={styles.bold}>{doj}</Text>, as an Assistant Professor in
          the Department of <Text style={styles.bold}>{department}</Text> and
          presently, he is working as{" "}
          <Text style={styles.bold}>{currentDesignation}</Text> since{" "}
          <Text style={styles.bold}>{currentDesignationDate}</Text>.
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>{dependentName}</Text>, who is also an Indian
          national, is a spouse and dependent family member of{" "}
          <Text style={styles.bold}>{facultyName}</Text> and her identity is
          certified. This organization has no objection to issue an Indian
          Passport to her.
        </Text>

        <Text style={styles.para}>
          I, the undersigned, am duly authorized to sign this Identity
          Certificate. I have read the provisions of Section 6(2) of the
          Passports Act, 1967 and certify that these are not attracted in case
          of this applicant. I recommend issue of an Indian Passport to her.
          It is certified that this organization is a Central Government
          Autonomous Body working under Ministry of Education, Government of
          India.
        </Text>

        <Text style={styles.para}>
          The Identity Card Number of{" "}
          <Text style={styles.bold}>{facultyName}</Text> is{" "}
          <Text style={styles.bold}>{idCardNumber}</Text>.
        </Text>

        {/* ================= REF NO ================= */}
        <View style={styles.refRow}>
          <Text>
            <Text style={styles.bold}>Ref. No.:</Text> {refNo}
          </Text>
          <Text>
            <Text style={styles.bold}>Date:</Text> {issueDate}
          </Text>
        </View>

        {/* ================= PHOTO & SIGNATURE ================= */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.photoBox}>
            {applicantPhoto ? (
              <Image src={applicantPhoto} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text>
                Applicant’s photo to be attested by certifying authority
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.bold}>Signature:</Text>
            {signature ? (
              <Image src={signature} style={styles.signature} />
            ) : (
              <View style={{ borderBottomWidth: 1, width: 160, marginTop: 12 }} />
            )}

            <Text style={{ marginTop: 14 }}>
              Assistant Registrar, Faculty Affairs
            </Text>
            <Text>Indian Institute of Technology Indore</Text>
            <Text>Simrol, Khandwa Road, Indore – 453552</Text>
            <Text>Madhya Pradesh, India</Text>
            <Text style={{ marginTop: 4, fontSize: 10 }}>
              Email: arfacultyaffairs@iiti.ac.in
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
