// InterventionAttestation.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  // Font,
} from "@react-pdf/renderer";

// Define the interface for the intervention prop
export interface Intervention {
  id: number;
  title: string;
  start: Date;
  end: Date;
  customer: string;
  address: string;
  type: string;
  status: string;
  technician: string;
}

// Define props for the InterventionAttestation component
interface InterventionAttestationProps {
  intervention: Intervention;
  comments: string;
}

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  content: {
    marginBottom: 5,
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

// The InterventionAttestation component generates a PDF document
export const InterventionAttestation: React.FC<InterventionAttestationProps> = ({
  intervention,
  comments,
}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Attestation d&apos;Intervention</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Titre:</Text>
          <Text style={styles.content}>{intervention.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.content}>{intervention.customer}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.content}>{intervention.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Technicien:</Text>
          <Text style={styles.content}>{intervention.technician}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type d&apos;Intervention:</Text>
          <Text style={styles.content}>{intervention.type}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Début:</Text>
          <Text style={styles.content}>
            {new Date(intervention.start).toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fin:</Text>
          <Text style={styles.content}>
            {new Date(intervention.end).toLocaleString()}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Commentaires:</Text>
          <Text style={styles.content}>{comments || "Aucun commentaire."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Statut:</Text>
          <Text style={styles.content}>{intervention.status}</Text>
        </View>
      </Page>
    </Document>
  );
};
