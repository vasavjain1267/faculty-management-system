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
    marginBottom: 16,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    textDecoration: "underline",
  },

  english: {
    fontFamily: "Helvetica",
  },

  label: {
    fontWeight: "bold",
  },

  box: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  field: {
    width: "48%",
  },

  line: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
})

/* ======================================================
   COMPONENT
   ====================================================== */
export default function AddressProofPDF({ data }: Props) {
  const {
    facultyName = "",
    designation = "",
    department = "",
    dateOfJoining = "",
    currentDesignation = "",
    currentDesignationDate = "",
    dependentName = "",
    relationship = "",
    addressHindi = "",
    addressEnglish = "",
    reason = "",
    signature = "",
    issueDate = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={[styles.english, { fontWeight: "bold" }]}>
            OFFICE OF FACULTY AFFAIRS
          </Text>
          <Text style={styles.english}>
            Indian Institute of Technology Indore
          </Text>
        </View>

        <Text style={styles.title}>ADDRESS PROOF CERTIFICATE</Text>
        <Text style={[styles.english, { marginTop: 10 }]}>
          This is to certify that {facultyName} joined Indian Institute of
          Technology Indore on {dateOfJoining} as {designation} in the
          Department of {department} and is presently working as{" "}
          {currentDesignation} w.e.f. {currentDesignationDate}.
        </Text>

        <Text style={[styles.english, { marginTop: 6 }]}>
          It is also certified that {dependentName} is the {relationship} of{" "}
          {facultyName}.
        </Text>

        <Text style={[styles.english, styles.label, { marginTop: 8 }]}>
          Residential Address as per Institute records:
        </Text>

        <View style={styles.box}>
          <Text style={styles.english}>{addressEnglish}</Text>
        </View>

        <Text style={[styles.english, { marginTop: 8 }]}>
          This certificate is issued to {facultyName} for the purpose of{" "}
          {reason}.
        </Text>

        <Text style={[styles.english, { marginTop: 6 }]}>
          This Address Proof Certificate is published in English and Hindi
          languages. In case of any discrepancy, the English version shall
          prevail.
        </Text>

        {/* ================= SIGNATURE ================= */}
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Signature:</Text>
            {signature ? (
              <Image
                src={signature}
                style={{ marginTop: 8, width: 120, height: 40 }}
              />
            ) : (
              <View style={styles.line} />
            )}
          </View>

          <View style={styles.field}>
            <Text>
              <Text style={styles.label}>Date:</Text> {issueDate}
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 30, fontSize: 10 }}>
          Assistant Registrar, Faculty Affairs
        </Text>
      </Page>
    </Document>
  )
}