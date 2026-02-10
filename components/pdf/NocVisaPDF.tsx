// components/pdf/NocVisaPDF.tsx

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
    marginBottom: 20,
    fontSize: 10,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    textDecoration: "underline",
  },

  subtitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },

  label: {
    fontWeight: "bold",
  },

  footer: {
    marginTop: 30,
  },

  contactInfo: {
    marginTop: 12,
    fontSize: 9,
    lineHeight: 1.4,
  },

  recipient: {
    marginTop: 30,
    fontSize: 10,
  },
})

/* ======================================================
   COMPONENT
   ====================================================== */
export default function NocVisaPDF({ data }: Props) {
  const {
    refNumber = "IITI/FA/PT/34/2026/",
    issueDate = "",
    applicantName = "",
    gender = "she",
    dateOfJoining = "",
    entryDesignation = "Assistant Professor",
    department = "",
    currentDesignation = "Professor",
    currentDesignationDate = "",
    passportNumber = "",
    travelCountry = "",
    purpose = "",
    eventName = "",
    eventLocation = "",
    travelStartDate = "",
    travelEndDate = "",
    fundingSource = "",
    signature = "",
    recipientName = "",
    recipientDesignation = "",
    recipientDepartment = "",
  } = data

  // Format dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Format date range for travel
  const formatDateRange = () => {
    if (!travelStartDate && !travelEndDate) return ""
    const start = new Date(travelStartDate)
    const end = new Date(travelEndDate)
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(travelStartDate)
    }
    
    return `${start.getDate()}-${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text>OFFICE OF FACULTY AFFAIRS</Text>
        </View>

        {/* ================= REFERENCE & DATE ================= */}
        <Text style={styles.refNumber}>{refNumber}</Text>
        <Text style={styles.date}>{formatDate(issueDate)}</Text>

        {/* ================= TITLE ================= */}
        <Text style={styles.title}>NO OBJECTION CERTIFICATE:</Text>
        <Text style={styles.subtitle}>
          VISITORS INTERNATIONAL STAY ADMISSION (VISA)
        </Text>

        {/* ================= MAIN CONTENT ================= */}
        <Text style={styles.paragraph}>
          {employeeName} joined Indian Institute of Technology Indore on{" "}
          {formatDate(dateOfJoining)}, as {entryDesignation} in the Department of{" "}
          {department} and presently, {gender} is working as {currentDesignation}
          {currentDesignationDate ? ` since ${formatDate(currentDesignationDate)}` : ""}.
        </Text>

        <Text style={styles.paragraph}>
          The Passport No. of {employeeName} is {passportNumber}.
        </Text>

        <Text style={styles.paragraph}>
          The Institute has no objection to being granted a VISA to travel {travelCountry}{" "}
          {purpose}
          {eventName && ` to the "${eventName}"`}
          {eventLocation && ` to be held at ${eventLocation}`}
          {(travelStartDate || travelEndDate) && ` during ${formatDateRange()}`}.
        </Text>

        <Text style={styles.paragraph}>
          {gender.charAt(0).toUpperCase() + gender.slice(1)} will resume {gender === "he" ? "his" : gender === "she" ? "her" : "their"} duties after {gender === "he" ? "his" : gender === "she" ? "her" : "their"} return from abroad.
        </Text>

        {fundingSource && (
          <Text style={styles.paragraph}>
            The entire travel expenses of the visit will be covered by {fundingSource}.
          </Text>
        )}

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
          
          <Text>Assistant Registrar, Faculty Affairs</Text>
        </View>

        {/* ================= CONTACT INFO ================= */}
        <View style={styles.contactInfo}>
          <Text>Indian Institute of Technology Indore</Text>
          <Text>Simrol, Khandwa Road, Indore-453552</Text>
          <Text>Madhya Pradesh, India</Text>
          <Text>Office: +91 731 6603509</Text>
          <Text>Email-id: arfacultyaffairs@iiti.ac.in</Text>
        </View>

        {/* ================= RECIPIENT ================= */}
        <View style={styles.recipient}>
          <Text>{recipientName || "Name"},</Text>
          <Text>{recipientDesignation || "Designation"}</Text>
          <Text>{recipientDepartment || "Department"}</Text>
          <Text>IIT Indore</Text>
        </View>
      </Page>
    </Document>
  )
}