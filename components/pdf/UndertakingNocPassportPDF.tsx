// components/pdf/UndertakingNocPassportPDF.tsx

import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

export type UndertakingNocPassportPDFProps = {
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

  institute: {
    fontSize: 12,
    fontWeight: "bold",
  },

  address: {
    fontSize: 10,
    marginTop: 2,
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
    marginTop: 8,
    minHeight: 90,
  },

  footer: {
    marginTop: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  field: {
    width: "48%",
  },

  line: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
})

export default function UndertakingNocPassportPDF({ data }: UndertakingNocPassportPDFProps) {
  const dependentMembers = data.dependentMembers || ""
  const name = data.name || ""
  const date = data.date || ""
  const department = data.department || ""

  // ✅ base64 signature
  const signature = data.signature || ""

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.institute}>Indian Institute of Technology Indore</Text>
          <Text style={styles.address}>Simrol, Khandwa Road, Indore</Text>
          <Text style={styles.address}>Madhya Pradesh – 453 552</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Undertaking</Text>

        {/* MAIN CONTENT */}
        <Text style={styles.para}>
          {"\t"}I undertake that below enlisted dependent family members are not attracted to the provisions of
          Section 6(2) of the Passports Act, 1967.
        </Text>

        <Text style={styles.para}>
          Subject to the other provisions of this Act, the passport authority shall refuse to issue a passport or
          travel document for visiting any foreign country under clause (c) of sub-section (2) of section 5 on any
          one or more of the following grounds, and on no other ground, namely:— (a) that the applicant is not a
          citizen of India; (b) that the applicant may, or is likely to, engage outside India in activities
          prejudicial to the sovereignty and integrity of India; (c) that the departure of the applicant from India
          may, or is likely to, be detrimental to the security of India; (d) that the presence of the applicant
          outside India may, or is likely to, prejudice the friendly relations of India with any foreign country;
          (e) that the applicant has, at any time during the period of five years immediately preceding the date of
          his application, been convicted by a court in India for any offence involving moral turpitude and
          sentenced in respect thereof to imprisonment for not less than two years; (f) that proceedings in respect
          of an offence alleged to have been committed by the applicant are pending before a criminal court in
          India; (g) that a warrant or summons for the appearance, or a warrant for the arrest, of the applicant
          has been issued by a court under any law for the time being in force or that an order prohibiting the
          departure from India of the applicant has been made by any such court; (h) that the applicant has been
          repatriated and has not reimbursed the expenditure incurred in connection with such repatriation; (i)
          that in the opinion of the Central Government the issue of a passport or travel document to the applicant
          will not be in the public interest.
        </Text>

        <Text style={{ marginTop: 8 }}>
          <Text style={styles.label}>Name of the Dependent Family members & their relation:</Text>
        </Text>

        <View style={styles.box}>
          <Text>{dependentMembers}</Text>
        </View>

        <Text style={{ marginTop: 18 }}>
          Therefore, it is kindly requested to issue the NOC “Annexure - A” in support to the Passport application
          of the above employee and dependent family members.
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.row}>
            {/* ✅ SIGNATURE FIELD */}
            <View style={styles.field}>
              <Text>
                <Text style={styles.label}>Signature:</Text>
              </Text>

              {signature ? (
                <Image src={signature} style={{ marginTop: 8, width: 120, height: 40 }} />
              ) : (
                <View style={styles.line} />
              )}
            </View>

            <View style={styles.field}>
              <Text>
                <Text style={styles.label}>Name:</Text> {name}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text>
                <Text style={styles.label}>Date:</Text> {date}
              </Text>
            </View>

            <View style={styles.field}>
              <Text>
                <Text style={styles.label}>Department:</Text> {department}
              </Text>
            </View>
          </View>

          <Text style={{ marginTop: 25, fontSize: 10 }}>
            IIT Indore, Simrol, Khandwa Road, Indore, Madhya Pradesh - 453 552
          </Text>
        </View>
      </Page>
    </Document>
  )
}
