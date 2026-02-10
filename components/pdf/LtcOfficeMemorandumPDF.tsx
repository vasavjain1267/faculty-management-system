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
})

export default function LtcOfficeMemorandumPDF({ data }: Props) {
  const {
    facultyName = "",
    designation = "",
    department = "",
    ltcType = "",
    fromDate = "",
    toDate = "",
    destination = "",
    advanceAmount = "",
    issueDate = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>OFFICE MEMORANDUM</Text>
          <Text style={{ fontSize: 10 }}>Indian Institute of Technology Indore</Text>
        </View>

        <Text style={styles.title}>Leave Travel Concession (LTC)</Text>

        <Text style={styles.para}>Date: {issueDate ? new Date(issueDate).toLocaleDateString() : ""}</Text>

        <Text style={styles.para}>
          Permission is granted to {facultyName}, {designation}, {department}, to avail LTC for the period from{" "}
          {fromDate ? new Date(fromDate).toLocaleDateString() : ""} to{" "}
          {toDate ? new Date(toDate).toLocaleDateString() : ""}.
        </Text>

        <Text style={styles.para}>Destination: {destination}</Text>
        <Text style={styles.para}>LTC Type: {ltcType}</Text>
        {advanceAmount && <Text style={styles.para}>Advance Sanctioned: Rs. {advanceAmount}</Text>}

        <Text style={{ marginTop: 40 }}>Authorized Signatory</Text>
        <Text style={{ marginTop: 20 }}>_________________</Text>
      </Page>
    </Document>
  )
}
