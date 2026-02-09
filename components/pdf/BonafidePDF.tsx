import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

export type BonafidePDFProps = {
  data: Record<string, string>
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 45,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.35,
  },

  title: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },

  normal: {
    fontSize: 11,
  },

  bold: {
    fontWeight: "bold",
  },

  block: {
    marginBottom: 10,
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },

  tableRow: {
    flexDirection: "row",
  },

  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 6,
    minHeight: 26,
    justifyContent: "center",
  },

  lastCell: {
    padding: 6,
    minHeight: 26,
    justifyContent: "center",
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  labelCell: {
    width: "35%",
  },

  valueCell: {
    width: "65%",
  },

  halfLabel: {
    width: "20%",
  },

  halfValue: {
    width: "30%",
  },

  purposeLabel: {
    width: "35%",
    justifyContent: "flex-start",
  },

  purposeValue: {
    width: "65%",
    justifyContent: "flex-start",
  },

  purposeText: {
    fontSize: 10,
    lineHeight: 1.25,
  },

  signatureRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signatureBox: {
    width: "48%",
    minHeight: 40,
    justifyContent: "flex-end",
  },

  addressTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },

  addressTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },

  addressCell: {
    width: "50%",
    padding: 8,
    minHeight: 80,
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "space-between",
  },

  addressCellLast: {
    width: "50%",
    padding: 8,
    minHeight: 80,
    justifyContent: "space-between",
  },

  note: {
    marginTop: 12,
    fontSize: 9.5,
  },
})

export default function BonafidePDF({ data }: BonafidePDFProps) {
  const name = data.name || ""
  const fatherName = data.fatherName || ""
  const program = data.program || ""
  const branch = data.branch || ""
  const year = data.year || ""
  const semester = data.semester || ""
  const purpose = data.purpose || ""
  const mobile = data.mobile || ""
  const email = data.email || ""

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Application format for Bonafide Certificate / NOC</Text>

        {/* To block */}
        <View style={styles.block}>
          <Text>To</Text>
          <Text>The Dy. Registrar</Text>
          <Text>IIT Indore</Text>
        </View>

        {/* Subject */}
        <View style={styles.block}>
          <Text>
            <Text style={styles.bold}>Subject:</Text> Application for Bonafide Certificate.
          </Text>
        </View>

        {/* Sir + intro */}
        <View style={styles.block}>
          <Text>Sir,</Text>
          <Text style={{ marginTop: 6 }}>
            {"         "}The details required for issue of a bonafide certificate are as under: -
          </Text>
        </View>

        {/* MAIN TABLE */}
        <View style={styles.table}>
          {/* Row 1: Name */}
          <View style={[styles.tableRow, styles.rowBorder]}>
            <View style={[styles.cell, styles.labelCell]}>
              <Text>Name (in Block Letters)</Text>
            </View>
            <View style={[styles.lastCell, styles.valueCell]}>
              <Text>{name}</Text>
            </View>
          </View>

          {/* Row 2: Father */}
          <View style={[styles.tableRow, styles.rowBorder]}>
            <View style={[styles.cell, styles.labelCell]}>
              <Text>Father’s Name:</Text>
            </View>
            <View style={[styles.lastCell, styles.valueCell]}>
              <Text>{fatherName}</Text>
            </View>
          </View>

          {/* Row 3: Program + Branch */}
          <View style={[styles.tableRow, styles.rowBorder]}>
            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Program</Text>
            </View>
            <View style={[styles.cell, styles.halfValue]}>
              <Text>{program}</Text>
            </View>

            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Branch</Text>
            </View>
            <View style={[styles.lastCell, styles.halfValue]}>
              <Text>{branch}</Text>
            </View>
          </View>

          {/* Row 4: Year + Semester */}
          <View style={[styles.tableRow, styles.rowBorder]}>
            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Year</Text>
            </View>
            <View style={[styles.cell, styles.halfValue]}>
              <Text>{year}</Text>
            </View>

            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Semester</Text>
            </View>
            <View style={[styles.lastCell, styles.halfValue]}>
              <Text>{semester}</Text>
            </View>
          </View>

          {/* Row 5: Purpose */}
          <View style={[styles.tableRow, styles.rowBorder]}>
            <View style={[styles.cell, styles.purposeLabel]}>
              <Text>Purpose of the certificate</Text>
              <Text style={{ fontSize: 9 }}>(Strikeout whichever is not applicable)</Text>
            </View>

            <View style={[styles.lastCell, styles.purposeValue]}>
              <Text style={styles.purposeText}>
                Bonafide Certificate{"\n"}
                Bonafide with Residential Certificate{"\n"}
                Bonafide for Passport/Visa{"\n"}
                Bonafide for Summer Internship{"\n"}
                Misl. (To be specified): ___________________________
              </Text>

              <Text style={{ marginTop: 6, fontSize: 10 }}>
                Selected / Written Purpose: <Text style={styles.bold}>{purpose}</Text>
              </Text>
            </View>
          </View>

          {/* Row 6: Mobile + Email */}
          <View style={styles.tableRow}>
            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Mobile:</Text>
            </View>
            <View style={[styles.cell, styles.halfValue]}>
              <Text>{mobile}</Text>
            </View>

            <View style={[styles.cell, styles.halfLabel]}>
              <Text>Email ID:</Text>
            </View>
            <View style={[styles.lastCell, styles.halfValue]}>
              <Text>{email}</Text>
            </View>
          </View>
        </View>

        {/* Signature + Date */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text>Signature of Student</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Date</Text>
          </View>
        </View>

        {/* Address Verification */}
        <Text style={styles.addressTitle}>Address Verification:</Text>

        <View style={styles.addressTable}>
          <View style={styles.tableRow}>
            {/* Hostler */}
            <View style={styles.addressCell}>
              <Text style={styles.bold}>Hostler</Text>
              <Text>Certified that the address given by the student is correct.</Text>
              <Text style={{ textAlign: "right" }}>Warden/Hostel Supervisor</Text>
            </View>

            {/* Day Scholar */}
            <View style={styles.addressCellLast}>
              <Text style={styles.bold}>Day Scholar</Text>
              <Text>Certified that the address given by the student is correct.</Text>
              <Text style={{ textAlign: "right" }}>DR/AR/Academic Office</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Note: Student has to show his/her IIT Indore Identity card at the time of submission of this application.
        </Text>
      </Page>
    </Document>
  )
}


