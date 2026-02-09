import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

export type RDRequestPDFProps = {
  data: Record<string, string>
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
})

export default function RDRequestPDF({ data }: RDRequestPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>R&D Request Form (R-15)</Text>

        <Text>Name: {data.name}</Text>
        <Text>Department: {data.department}</Text>

        {/* Add rest of your PDF layout here */}
      </Page>
    </Document>
  )
}