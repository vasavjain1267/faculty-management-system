import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

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
    lineHeight: 1.4,
  },

  header: {
    textAlign: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 18,
    textDecoration: "underline",
  },

  para: {
    marginBottom: 10,
    textAlign: "justify",
  },

  label: {
    fontWeight: "bold",
  },

  box: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginTop: 6,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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

export default function LtcOfficeMemorandumPDF({ data }: Props) {
  const {
    facultyName = "",
    designation = "",
    department = "",
    hometown = "",
    blockYear = "",
    journeyDetails = "",
    leaveDetails = "",
    advanceRequested = "",
    advanceAdmissible = "",
    basicPay = "",
    encashment = "",
    signature = "",
    date = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={{ fontWeight: "bold" }}>OFFICE OF FACULTY AFFAIRS</Text>
          <Text>Indian Institute of Technology Indore</Text>
        </View>

        <Text style={styles.title}>OFFICE MEMORANDUM</Text>

        {/* MAIN PARAGRAPH */}
        <Text style={styles.para}>
          With reference to the request from <Text style={styles.label}>{facultyName}</Text>,{" "}
          {designation}, Department of {department}, for sanction of LTC to hometown / destination{" "}
          <Text style={styles.label}>{hometown}</Text> for the block year{" "}
          <Text style={styles.label}>{blockYear}</Text>, the provisions of the same are approved as
          per the following details:
        </Text>

        <Text style={styles.label}>Journey Details:</Text>
        <View style={styles.box}>
          <Text>{journeyDetails}</Text>
        </View>

        <Text style={styles.label}>Leave Details during LTC:</Text>
        <View style={styles.box}>
          <Text>{leaveDetails}</Text>
        </View>

        <Text style={styles.para}>
          <Text style={styles.label}>Advance Requested:</Text> ₹ {advanceRequested}
        </Text>

        <Text style={styles.para}>
          <Text style={styles.label}>Advance Admissible:</Text> ₹ {advanceAdmissible}
        </Text>

        <Text style={styles.para}>
          <Text style={styles.label}>Basic Pay:</Text> {basicPay}
        </Text>

        <Text style={styles.para}>
          <Text style={styles.label}>Encashment of 10 Days EL:</Text> {encashment}
        </Text>

        {/* SIGNATURE */}
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Signature:</Text>
            {signature ? (
              <Image src={signature} style={{ marginTop: 8, width: 120, height: 40 }} />
            ) : (
              <View style={styles.line} />
            )}
          </View>

          <View style={styles.field}>
            <Text>
              <Text style={styles.label}>Date:</Text> {date}
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
