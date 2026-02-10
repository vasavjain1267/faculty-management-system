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
  signature: {
    marginTop: 40,
  },
})

export default function UndertakingNocPassportPDF({ data }: Props) {
  const {
    applicantName = "",
    facultyName = "",
    department = "",
    dependentMembers = "",
    date = "",
    signature = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Indian Institute of Technology Indore</Text>
          <Text style={{ fontSize: 10 }}>Simrol, Khandwa Road, Indore</Text>
          <Text style={{ fontSize: 10 }}>Madhya Pradesh – 453 552</Text>
        </View>

        <Text style={styles.title}>Undertaking</Text>

        <Text style={styles.para}>
          I undertake that below enlisted dependent family members are not attracted to the provisions of Section
          6(2) of the Passports Act, 1967.
        </Text>

        <Text style={styles.para}>
          Subject to the other provisions of this Act, the passport authority shall refuse to issue a passport or
          travel document to a person, where the applicant is a serving member of any of the armed forces of the
          Union and, in respect of such person, the prior permission in writing of the Central Government is
          necessary.
        </Text>

        <Text style={styles.para}>Dependent Family Members:</Text>
        <Text style={styles.para}>{dependentMembers}</Text>

        <Text style={styles.para}>
          I hereby declare that the above information is true to the best of my knowledge and belief.
        </Text>

        <View style={styles.signature}>
          <Text>Name: {applicantName || facultyName}</Text>
          <Text>Department: {department}</Text>
          <Text>Date: {date ? new Date(date).toLocaleDateString() : ""}</Text>
          
          {signature && (
            <View style={{ marginTop: 20 }}>
              <Image src={signature} style={{ width: 150, height: 60 }} />
              <Text>Signature</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
