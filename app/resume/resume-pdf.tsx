import React from 'react';
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import path from 'node:path';
import type { ResumeDocument } from '@/lib/resume';

const cmuFontPath = (...parts: string[]) =>
  path.join(
    process.cwd(),
    'node_modules',
    'computer-modern',
    'fonts',
    ...parts
  );

Font.register({
  family: 'CMU Serif',
  fonts: [
    {
      src: cmuFontPath('cmu-serif-500-roman.ttf'),
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: cmuFontPath('cmu-serif-500-italic.ttf'),
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: cmuFontPath('cmu-serif-700-roman.ttf'),
      fontWeight: 700,
      fontStyle: 'normal',
    },
    {
      src: cmuFontPath('cmu-serif-700-italic.ttf'),
      fontWeight: 700,
      fontStyle: 'italic',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 30,
    fontFamily: 'CMU Serif',
    fontWeight: 400,
    fontSize: 9.9,
    lineHeight: 1.15,
    color: '#000000',
  },
  header: { alignItems: 'center', marginBottom: 6 },
  name: {
    fontWeight: 500,
    fontSize: 23,
    lineHeight: 1.15,
    marginBottom: 5,
  },
  contact: { flexDirection: 'row', alignItems: 'center', fontSize: 9.2 },
  link: { color: '#000000', textDecoration: 'underline' },
  divider: { marginHorizontal: 4 },
  section: { marginTop: 5 },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 12.2,
    borderBottomWidth: 0.75,
    borderBottomColor: '#000000',
    paddingBottom: 2.5,
    marginBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  bold: { fontWeight: 700 },
  italic: { fontStyle: 'italic' },
  paragraph: { marginTop: 1.2 },
  stack: { gap: 2.1 },
  entry: { breakInside: 'avoid' },
  nestedRole: {
    marginTop: 2.25,
    paddingTop: 2.25,
  },
  bulletRow: { flexDirection: 'row', paddingLeft: 10, paddingRight: 2 },
  bullet: { width: 9, textAlign: 'center' },
  // Justified so wrapped lines reach the right margin instead of leaving a
  // ragged edge — matches the HTML view in globals.css
  bulletText: { flex: 1, textAlign: 'justify' },
  projectOrg: { fontStyle: 'italic' },
  awardsLine: {
    fontSize: 8.3,
    lineHeight: 1.1,
    paddingLeft: 2,
    textAlign: 'justify',
  },
});

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PdfBullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <View>
      {items.map((item, index) => {
        const sentence = /[.!?]$/.test(item.trim())
          ? item.trim()
          : `${item.trim()}.`;
        const labelEnd = sentence.indexOf(':');
        const label = labelEnd > 0 ? sentence.slice(0, labelEnd + 1) : '';
        const detail = label
          ? sentence.slice(labelEnd + 1).trimStart()
          : sentence;

        return (
          <View style={styles.bulletRow} key={`${item}-${index}`}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              {label ? <Text style={styles.bold}>{label} </Text> : null}
              {detail}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function PdfAwardsLine({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <Text style={styles.awardsLine}>
      {items.map((item, index) => (
        <React.Fragment key={`${item}-${index}`}>
          {index ? '; ' : ''}
          {item}
        </React.Fragment>
      ))}
    </Text>
  );
}

export function ResumePdf({ resume }: { resume: ResumeDocument }) {
  const { contact, education, awards, skills } = resume.static;

  return (
    <Document
      title={`${contact.name} Resume`}
      author={contact.name}
      subject="Resume"
    >
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{contact.name}</Text>
          <View style={styles.contact}>
            <Link style={styles.link} src={`mailto:${contact.email}`}>
              {contact.email}
            </Link>
            {contact.links.map((link) => (
              <View style={styles.contact} key={link.label}>
                <Text style={styles.divider}>-</Text>
                {link.href ? (
                  <Link style={styles.link} src={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <Text>{link.label}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <PdfSection title="Education">
          <View style={styles.row}>
            <Text style={styles.bold}>{education.school}</Text>
            <Text style={styles.bold}>{education.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.italic}>{education.degree}</Text>
            <Text style={styles.italic}>{education.graduation}</Text>
          </View>
          <PdfBullets
            items={[
              `Activities: ${education.activities.join(', ')}`,
              `Selected Coursework: ${education.coursework.join(', ')}`,
              `GPA: ${education.gpa}`,
            ]}
          />
        </PdfSection>

        <PdfSection title="Experience">
          <View style={styles.stack}>
            {resume.experience.map((organization) => (
              <View style={styles.entry} key={organization.name} wrap={false}>
                <View style={styles.row}>
                  {organization.link ? (
                    <Link
                      style={[styles.bold, styles.link]}
                      src={organization.link}
                    >
                      {organization.name}
                    </Link>
                  ) : (
                    <Text style={styles.bold}>{organization.name}</Text>
                  )}
                  <Text style={styles.bold}>{organization.location}</Text>
                </View>
                {organization.roles.map((role, roleIndex) => (
                  <View
                    style={roleIndex ? styles.nestedRole : undefined}
                    key={role.id}
                  >
                    <View style={styles.row}>
                      <Text style={styles.italic}>{role.title}</Text>
                      <Text style={styles.italic}>{role.date}</Text>
                    </View>
                    <PdfBullets items={role.bullets} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </PdfSection>

        <PdfSection title="Projects">
          <View style={styles.stack}>
            {resume.projects.map((project) => (
              <View style={styles.entry} key={project.id} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>
                    {project.link ? (
                      <Link style={styles.link} src={project.link}>
                        {project.name}
                      </Link>
                    ) : (
                      project.name
                    )}
                    {project.organization ? (
                      <Text style={styles.projectOrg}>
                        {' '}
                        | {project.organization}
                      </Text>
                    ) : null}
                  </Text>
                  <Text>{project.date}</Text>
                </View>
                <PdfBullets items={project.bullets} />
              </View>
            ))}
          </View>
        </PdfSection>

        <PdfSection title="Awards">
          <PdfAwardsLine items={awards} />
        </PdfSection>

        <PdfSection title="Skills">
          {skills.map((skill) => (
            <Text key={skill.label} style={styles.paragraph}>
              <Text style={styles.bold}>{skill.label}: </Text>
              {skill.items.join(', ')}
            </Text>
          ))}
        </PdfSection>
      </Page>
    </Document>
  );
}
