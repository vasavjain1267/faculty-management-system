// components/pdf/BonafidePDF.tsx

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

  refNumber: {
    textAlign: "left",
    marginBottom: 4,
    fontSize: 10,
  },

  date: {
    textAlign: "right",
    marginBottom: 16,
    fontSize: 10,
  },

  title: {
    fontSize: 13,
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

  table: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#000",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  tableRowLast: {
    flexDirection: "row",
  },

  tableCell: {
    padding: 6,
    fontSize: 10,
    flex: 1,
  },

  tableCellBorder: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },

  footer: {
    marginTop: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  field: {
    width: "48%",
  },

  line: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  recipient: {
    marginTop: 30,
    fontSize: 10,
  },

  contactInfo: {
    marginTop: 20,
    fontSize: 9,
    lineHeight: 1.4,
  },
})

/* ======================================================
   COMPONENT
   ====================================================== */
export default function BonafidePDF({ data }: Props) {
  const {
    refNumber = "IITI/FA/PT/8/2025/",
    issueDate = "",
    applicantName = "",
    entryDesignation = "",
    currentDesignation = "",
    currentDesignationDate = "",
    department = "",
    purpose = "",
    requestedBy = "",
    recipientName = "",
    recipientDesignation = "",
    recipientOrganization = "",
    signature = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.english}>OFFICE OF FACULTY AFFAIRS</Text>
        </View>

        {/* ================= REFERENCE & DATE ================= */}
        <Text style={styles.refNumber}>{refNumber}</Text>
        <Text style={styles.date}>
          {issueDate ? new Date(issueDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : ""}
        </Text>

        {/* ================= TITLE ================= */}
        <Text style={[styles.title, styles.english]}>
          BONAFIDE CERTIFICATE
        </Text>

        {/* ================= INTRO ================= */}
        <Text style={[styles.english, { marginTop: 12, marginBottom: 8 }]}>
          The details with regards to the official from the Institute are as under:
        </Text>

        {/* ================= TABLE ================= */}
        <View style={styles.table}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableCellBorder]}>
              <Text style={styles.english}>(a) Name of Employee</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{applicantName}</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableCellBorder]}>
              <Text style={styles.english}>(b) Designation at Entry Level</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{entryDesignation}</Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableCellBorder]}>
              <Text style={styles.english}>(c) Present Designation with date</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>
                {currentDesignation}
                {currentDesignationDate ? ` (w.e.f. ${currentDesignationDate})` : ""}
              </Text>
            </View>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCell, styles.tableCellBorder]}>
              <Text style={styles.english}>(d) Department</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{department}</Text>
            </View>
          </View>
        </View>

        {/* ================= PURPOSE ================= */}
        <Text style={[styles.english, { marginTop: 12 }]}>
          This certificate is issued for {purpose ? purpose : "______"}.
        </Text>

        {/* ================= REQUEST ================= */}
        <Text style={[styles.english, { marginTop: 12 }]}>
          This certificate is issued at the request of {requestedBy || applicantName}.
        </Text>

        {/* ================= SIGNATURE ================= */}
        <View style={styles.footer}>
          {signature && (
            <View style={{ marginBottom: 12 }}>
              <Image
                src={signature}
                style={{ width: 120, height: 40 }}
              />
            </View>
          )}
          
          <Text style={styles.english}>
            Assistant Registrar, Faculty Affairs
          </Text>
        </View>

        {/* ================= CONTACT INFO ================= */}
        <View style={styles.contactInfo}>
          <Text style={styles.english}>Indian Institute of Technology Indore</Text>
          <Text style={styles.english}>Simrol, Khandwa Road, Indore-453552</Text>
          <Text style={styles.english}>Madhya Pradesh, India</Text>
          <Text style={styles.english}>Office: +91 731 6603509</Text>
          <Text style={styles.english}>Email-id: arfacultyaffairs@iiti.ac.in</Text>
        </View>

        {/* ================= RECIPIENT ================= */}
        <View style={styles.recipient}>
          <Text style={[styles.english, { marginBottom: 4 }]}>To,</Text>
          <Text style={styles.english}>{recipientName || "Name"},</Text>
          <Text style={styles.english}>
            {recipientDesignation ? `${recipientDesignation}` : ""}
          </Text>
          <Text style={styles.english}>
            {recipientOrganization ? `${recipientOrganization}` : ""}
          </Text>
        </View>
      </Page>
    </Document>
  )
}