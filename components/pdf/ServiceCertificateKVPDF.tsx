import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer"

/* ======================================================
   FONT REGISTRATION (REQUIRED FOR HINDI)
   ====================================================== */
Font.register({
  family: "NotoDevanagari",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
})

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

  hindi: {
    fontFamily: "NotoDevanagari",
    fontSize: 11,
    lineHeight: 1.6,
  },

  english: {
    fontFamily: "Helvetica",
  },

  label: {
    fontWeight: "bold",
  },

  footer: {
    marginTop: 32,
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
export default function ServiceCertificateKVPDF({ data }: Props) {
  const {
    facultyName = "",
    joiningDate = "",
    department = "",
    employeeName = "",
    childName = "",
    issueDate = "",
    signature = "",
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={[styles.hindi, { fontWeight: "bold" }]}>
            संकाय कार्य कार्यालय
          </Text>
          <Text style={styles.english}>(OFFICE OF FACULTY AFFAIRS)</Text>
          <Text style={styles.english}>
            Indian Institute of Technology Indore
          </Text>
        </View>

        {/* ================= TITLE ================= */}
        <View style={{ marginVertical: 16, alignItems: "center" }}>
        {/* Hindi title */}
        <Text
            style={[
            styles.hindi,
            { fontSize: 12, fontWeight: "bold" },
            ]}
        >
            सेवा प्रमाण पत्र
        </Text>

        {/* English title */}
        <Text
            style={[
            styles.english,
            {
                fontSize: 12,
                fontWeight: "bold",
                textDecoration: "underline",
                marginTop: 2,
            },
            ]}
        >
            Service Certificate
        </Text>
        </View>


        {/* ================= HINDI ================= */}
        <Text style={styles.hindi}>
          यह प्रमाणित किया जाता है कि डॉ. {facultyName}, दिनांक {joiningDate} को
          भारतीय प्रौद्योगिकी संस्थान इंदौर के {department} विभाग में असिस्टेंट
          प्रोफेसर के पद पर कार्यरत हुए।
        </Text>

        <Text style={[styles.hindi, { marginTop: 6 }]}>
          वह भारत सरकार के शिक्षा मंत्रालय के तहत स्वायत्त निकाय के नियमित कर्मचारी
          हैं तथा उनकी सेवाएं अस्थानांतरणीय हैं।
        </Text>

        <Text style={[styles.hindi, { marginTop: 6 }]}>
          यह प्रमाण पत्र {employeeName} को उनके पुत्र {childName} के पीएम श्री
          केन्द्रीय विद्यालय आईआईटी इंदौर में प्रवेश हेतु जारी किया जाता है।
        </Text>

        {/* ================= ENGLISH ================= */}
        <Text style={[styles.english, { marginTop: 12 }]}>
          This is to certify that Dr. {facultyName} joined Indian Institute of
          Technology Indore on {joiningDate} as an Assistant Professor in the
          Department of {department}.
        </Text>

        <Text style={[styles.english, { marginTop: 6 }]}>
          He is a regular employee of an Autonomous Body under the Ministry of
          Education, Government of India, and his services are non-transferable.
        </Text>

        <Text style={[styles.english, { marginTop: 6 }]}>
          This certificate is issued to {employeeName} for his son {childName}'s
          admission in PM Shri Kendriya Vidyalaya IIT Indore.
        </Text>

        {/* ================= SIGNATURE ================= */}
        <View style={styles.footer}>
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

          <Text style={{ marginTop: 28, fontSize: 10 }}>
            Assistant Registrar, Faculty Affairs
          </Text>
          <Text style={{ fontSize: 10 }}>
            Indian Institute of Technology Indore
          </Text>
          <Text style={{ fontSize: 10 }}>
            Simrol, Khandwa Road, Indore – 453552
          </Text>
        </View>
      </Page>
    </Document>
  )
}
