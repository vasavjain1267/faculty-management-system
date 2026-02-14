import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

type Props = {
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
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  para: {
    marginVertical: 8,
    textAlign: "justify",
  },
  table: {
    marginVertical: 12,
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRightWidth: 1,
  },
})

export default function AnnexureAPassportPDF({ data }: Props) {
  const {
    facultyName = "",
    applicantName = "",
    fatherName = "",
    doj = "",
    department = "",
    currentDesignation = "",
    currentDesignationDate = "",
    idCardNumber = "",
    refNo = "",
    issueDate = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Indian Institute of Technology Indore</Text>
          <Text style={{ fontSize: 10 }}>Simrol, Khandwa Road, Indore - 453552</Text>
        </View>

        <Text style={styles.title}>ANNEXURE-A</Text>
        <Text style={styles.title}>Identity Certificate for Passport</Text>

        <Text style={styles.para}>Ref No: {refNo}</Text>
        <Text style={styles.para}>Date: {issueDate ? new Date(issueDate).toLocaleDateString() : ""}</Text>

        <Text style={styles.para}>
          This is to certify that {applicantName}, S/o or D/o {fatherName}, is known to me.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Name</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{applicantName}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Father/Spouse Name</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{fatherName}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Designation</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{currentDesignation}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Department</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{department}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Date of Joining</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{doj ? new Date(doj).toLocaleDateString() : ""}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>ID Card Number</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{idCardNumber}</Text>
            </View>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>Authorized Signatory</Text>
        <Text style={{ marginTop: 20 }}>_________________</Text>
      </Page>
    </Document>
  )
}
