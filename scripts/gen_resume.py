#!/usr/bin/env python3
"""Generate a clean resume PDF into public/resume.pdf from Tushar's resume content."""
from fpdf import FPDF

VIOLET = (139, 39, 218)
DARK = (30, 30, 35)
GREY = (90, 90, 95)


class Resume(FPDF):
    def header(self):
        pass

    def footer(self):
        pass


def section(pdf, title):
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*VIOLET)
    pdf.cell(0, 8, title.upper(), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.4)
    y = pdf.get_y()
    pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
    pdf.ln(2)
    pdf.set_text_color(*DARK)


def bullet(pdf, text):
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*DARK)
    x = pdf.get_x()
    pdf.cell(5, 5, chr(149))
    pdf.set_x(x + 5)
    pdf.multi_cell(0, 5, text, new_x="LMARGIN", new_y="NEXT")


pdf = Resume(format="A4")
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_margins(18, 15, 18)
pdf.add_page()

# Name
pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(*DARK)
pdf.cell(0, 10, "Tushar Gautam", new_x="LMARGIN", new_y="NEXT")

# Contact line
pdf.set_font("Helvetica", "", 9.5)
pdf.set_text_color(*GREY)
pdf.cell(0, 6, "Kharar, Punjab  |  +91 9780400311  |  gautams4work@gmail.com", new_x="LMARGIN", new_y="NEXT")
pdf.set_text_color(*VIOLET)
pdf.cell(0, 5, "Portfolio: https://tushargautam.software", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 5, "LinkedIn: linkedin.com/in/tushar-gautam-73a678314   |   GitHub: github.com/TU7SHAR", new_x="LMARGIN", new_y="NEXT")

# Summary
section(pdf, "Professional Summary")
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 5,
    "Frontend-focused Web Developer skilled in React.js and Next.js, with experience building "
    "interactive and performance-driven web applications. Currently working on chatbot systems using "
    "Python Flask and API integrations. Strong foundation in problem-solving and scalable web architecture.",
    new_x="LMARGIN", new_y="NEXT")

# Skills
section(pdf, "Technical Skills")
skills = [
    ("Languages", "C++, JavaScript, Python"),
    ("Frontend", "React.js, Next.js, Tailwind CSS, HTML, CSS, Three.js, GSAP"),
    ("Backend", "Flask, Node.js"),
    ("Database", "MongoDB, MySQL, PostgreSQL"),
    ("Tools", "Git, REST APIs, Postman, GitHub Copilot"),
    ("Other", "Data Structures & Algorithms (LeetCode, CodeChef), Prompt Engineering"),
]
for label, val in skills:
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*DARK)
    pdf.cell(28, 5, label + ":")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*GREY)
    pdf.multi_cell(0, 5, val, new_x="LMARGIN", new_y="NEXT")

# Projects
section(pdf, "Projects")
pdf.set_font("Helvetica", "B", 10.5)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 5, "app.bubbl.ooo - RAG Chatbot SaaS  |  Python Flask, Gemini API, Redis-Celery, PostgreSQL, JS, Paddle", new_x="LMARGIN", new_y="NEXT")
bullet(pdf, "Engineered a multi-tenant RAG chatbot platform where scraped web content is auto-vectorized into Gemini FileSearch stores, enabling businesses to deploy context-aware AI agents with persistent conversations and lead capture - zero ML infra managed manually (similar to chatbase.co).")
bullet(pdf, "Implemented background job processing with Celery + Redis for web scraping tasks.")
bullet(pdf, "Deployed on VPS with Gunicorn (gthread) and systemd service management.")
pdf.ln(2)
pdf.set_font("Helvetica", "B", 10.5)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 5, "bhavishai.in - AI Astrology  |  Next.js, Swiss Ephemeris, Gemini AI, Razorpay, PostgreSQL", new_x="LMARGIN", new_y="NEXT")
bullet(pdf, "Integrated Swiss Ephemeris (C-based library) to compute planetary longitudes and dashas from user details (DOB, POB), and used the Gemini API to produce specialized reports.")
bullet(pdf, "Implemented a payment-to-delivery pipeline with Razorpay signature verification, background PDF generation, email dispatch, and an admin reconciliation system for failed deliveries.")
bullet(pdf, "Built a protected admin panel with revenue dashboards, user journey analytics, and automated drip email sequences triggered by report completion status.")
pdf.ln(2)
pdf.set_font("Helvetica", "B", 10.5)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 5, "app.salesji.com - AI Telegram Bot Workspace  |  Telegram Bot API, AI Agents, Next.js, PostgreSQL", new_x="LMARGIN", new_y="NEXT")
bullet(pdf, "Built a workspace for creating and managing AI-powered Telegram sales bots, letting businesses deploy conversational agents that engage leads and automate sales conversations directly inside Telegram.")

# Education
section(pdf, "Education")
pdf.set_font("Helvetica", "B", 10.5)
pdf.set_text_color(*DARK)
pdf.cell(0, 5, "B.Tech in Computer Science & Engineering", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(*GREY)
pdf.cell(0, 5, "Rayat Bahra University, Mohali (Expected July 2026)  |  CGPA: 8.0", new_x="LMARGIN", new_y="NEXT")

# Additional
section(pdf, "Additional Information")
bullet(pdf, "Currently interning at DrishInfoTech. Building production SaaS products independently.")

pdf.output("public/resume.pdf")
print("resume.pdf generated")
