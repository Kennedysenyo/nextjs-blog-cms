import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Heading,
  Font,
  Section,
  Link,
} from "@react-email/components";

type Props = {
  email: string;
  text: string; // this is the verification URL
};

export default function EmailVerification({ email, text }: Props) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Body
        style={{
          padding: 0,
          margin: 0,
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Container style={{ backgroundColor: "#28A745", padding: "1.5rem" }}>
          <Heading
            style={{
              textAlign: "center",
              letterSpacing: "2px",
              color: "#ffffff",
            }}
          >
            Websendor
          </Heading>
        </Container>

        <Container style={{ padding: "1rem" }}>
          <Text>Hello {email},</Text>

          <Text>
            Please verify your email address to activate your account.
          </Text>

          <Hr />

          <Section>
            <Link
              href={text}
              target="_blank"
              style={{
                color: "#0863f5",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Verify your email address
            </Link>
          </Section>

          <Text style={{ marginTop: "1rem" }}>— Websendor Admin</Text>
        </Container>
      </Body>
    </Html>
  );
}
