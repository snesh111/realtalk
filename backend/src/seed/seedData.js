import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Vote from "../models/vote.model.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear all
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Vote.deleteMany({});
    console.log("✅ Cleared old data");

    // Create users
    const password = await bcrypt.hash("password123", 12);

    const users = await User.insertMany([
      { username: "arjun_dev", email: "arjun@gmail.com", password, role: "user" },
      { username: "priya_sharma", email: "priya@gmail.com", password, role: "user" },
      { username: "rohit_college", email: "rohit@gmail.com", password, role: "user" },
      { username: "neha_finance", email: "neha@gmail.com", password, role: "user" },
      { username: "vikram_ops", email: "vikram@gmail.com", password, role: "admin" },
    ]);

    const [arjun, priya, rohit, neha, vikram] = users;
    console.log("✅ Users created");

    // Real image URLs from Unsplash (free)
    const images = {
      tech: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      career: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
      finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      college: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      life: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      code: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      money: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
      study: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    };

    // Create posts
    const posts = await Post.insertMany([

      // ── TECH ──────────────────────────────────────────
      {
        title: "How to get a job at Google, Amazon or Microsoft from India in 2025?",
        content: "I am a 3rd year CSE student from a tier-2 college in India. My DSA is decent (solved 200+ LeetCode), I know Java and Python. What is the realistic roadmap to crack FAANG? Should I focus on competitive programming or system design? Any honest advice from people who have done it?",
        category: "Tech",
        tags: ["faang", "dsa", "placement"],
        userId: arjun._id,
        authorName: "arjun_dev",
        imageUrl: images.tech,
        voteCount: 47,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "Docker vs Kubernetes — which one should I learn first as a fresher DevOps engineer?",
        content: "I just got placed as a DevOps engineer at a startup. They use AWS, Docker and Kubernetes. I know basics of Linux and some Python scripting. Should I deep dive into Docker first or start Kubernetes directly? My joining date is in 2 months so I have time to prepare.",
        category: "Tech",
        tags: ["devops", "docker", "kubernetes"],
        userId: vikram._id,
        authorName: "vikram_ops",
        imageUrl: images.code,
        voteCount: 38,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "Is React still worth learning in 2025 or should I directly learn Next.js?",
        content: "I am a backend developer trying to become full stack. Everyone says learn React but I see a lot of job postings asking for Next.js. Should I skip React basics and go straight to Next.js? I already know Node.js and Express well.",
        category: "Tech",
        tags: ["react", "nextjs", "frontend"],
        userId: arjun._id,
        authorName: "arjun_dev",
        voteCount: 29,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "My GitHub has 0 contributions for 6 months — will it affect my job search?",
        content: "I was preparing for GATE for 6 months and completely stopped coding. Now I want to switch to software jobs but my GitHub looks dead. Recruiters check GitHub right? Should I be worried? How do I recover quickly?",
        category: "Tech",
        tags: ["github", "jobs", "career"],
        userId: rohit._id,
        authorName: "rohit_college",
        voteCount: 21,
        commentCount: 2,
        isAnonymous: false,
      },

      // ── CAREER ────────────────────────────────────────
      {
        title: "TCS vs Infosys vs Wipro — which one should I join as a fresher in 2025?",
        content: "I have offer letters from TCS (3.36 LPA), Infosys (3.6 LPA) and Wipro (3.5 LPA). I am confused which one to join. I want to grow technically and eventually move to a product company. Which company gives better tech exposure and learning opportunities for freshers?",
        category: "Career",
        tags: ["tcs", "infosys", "fresher", "placement"],
        userId: priya._id,
        authorName: "priya_sharma",
        imageUrl: images.career,
        voteCount: 56,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "How to negotiate salary as a fresher in India without losing the offer?",
        content: "I got an offer for 6 LPA from a mid-size product company. I feel the market rate for my skills is 8-9 LPA based on my research. I am scared that if I negotiate they might withdraw the offer. How to negotiate professionally without sounding greedy?",
        category: "Career",
        tags: ["salary", "negotiation", "offer"],
        userId: neha._id,
        authorName: "neha_finance",
        voteCount: 43,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "I got rejected from 50+ companies — what am I doing wrong?",
        content: "I am a 2022 pass out with 2 years of experience in React and Node.js. Applied to 50+ companies in last 3 months. Getting shortlisted but failing in technical rounds. My LeetCode rating is around 1600. I revise before interviews but still blank out. Is this normal? How to fix this?",
        category: "Career",
        tags: ["interview", "rejection", "jobs"],
        userId: arjun._id,
        authorName: "arjun_dev",
        voteCount: 89,
        commentCount: 3,
        isAnonymous: true,
      },
      {
        title: "Should I quit my 12 LPA job to start a startup at 26?",
        content: "I have been working at a product company for 3 years (currently 12 LPA). I have a SaaS idea for B2B HR automation that I validated with 3 potential clients. I have 8 months of savings. My parents are against it. Should I quit and go full time or keep the job and build on the side?",
        category: "Career",
        tags: ["startup", "entrepreneurship", "risk"],
        userId: vikram._id,
        authorName: "vikram_ops",
        voteCount: 67,
        commentCount: 2,
        isAnonymous: false,
      },

      // ── FINANCE ───────────────────────────────────────
      {
        title: "Best way to invest ₹10,000 per month as a 24-year-old software engineer in India?",
        content: "I just started my first job at 6 LPA. After rent, food and expenses I can save around ₹10,000 per month. I know nothing about investing. Should I do SIP in mutual funds? PPF? Fixed deposit? What is the smartest way to start building wealth at 24 with limited knowledge?",
        category: "Finance",
        tags: ["investment", "sip", "savings", "mutualfunds"],
        userId: neha._id,
        authorName: "neha_finance",
        imageUrl: images.finance,
        voteCount: 72,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "How to file ITR for the first time as a salaried employee? Step by step please",
        content: "This is my first job and first time filing ITR. My company gave me Form 16. I am completely confused about ITR1 vs ITR2, what deductions I can claim under 80C, HRA exemption etc. My salary is 7 LPA. Can someone give a simple step by step guide?",
        category: "Finance",
        tags: ["itr", "tax", "form16", "80c"],
        userId: rohit._id,
        authorName: "rohit_college",
        imageUrl: images.money,
        voteCount: 94,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "Should I buy a house at 28 or keep renting in Bangalore?",
        content: "I am 28, earning 18 LPA in Bangalore. Rent is ₹25,000/month for a 2BHK. A similar flat to buy costs ₹80 lakhs, EMI would be around ₹65,000/month for 20 years. Everyone in my family says buy now. But financially it does not make sense to me. What should I do?",
        category: "Finance",
        tags: ["realestate", "homeloan", "bangalore", "emi"],
        userId: priya._id,
        authorName: "priya_sharma",
        voteCount: 58,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "Credit card vs debit card — I am 22 and applying for my first credit card",
        content: "I just got my first salary account. Bank is offering me a credit card with ₹1 lakh limit. My friends say credit cards are dangerous and lead to debt. Others say they are great for building credit score and cashback. Should I get one? Which one is best for beginners?",
        category: "Finance",
        tags: ["creditcard", "creditscore", "banking"],
        userId: arjun._id,
        authorName: "arjun_dev",
        voteCount: 34,
        commentCount: 2,
        isAnonymous: false,
      },

      // ── COLLEGE ───────────────────────────────────────
      {
        title: "What to do in 1st year of engineering to not regret at placement time?",
        content: "I just joined CSE at a tier-3 college in Maharashtra. I don't want to waste my 4 years like seniors who are now struggling for jobs. What should I focus on in 1st year? Competitive programming? Projects? Internships? Please give honest advice, not generic stuff.",
        category: "College",
        tags: ["engineering", "firstyear", "cse", "placement"],
        userId: rohit._id,
        authorName: "rohit_college",
        imageUrl: images.college,
        voteCount: 112,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "CGPA vs skills — does CGPA matter for placements in India?",
        content: "My CGPA is 6.8 and I am in 3rd year. I have good projects and know full stack development. But many companies have a 7.0 cutoff. I am demotivated. Should I focus on improving CGPA in remaining semesters or double down on skills and target companies without cutoffs?",
        category: "College",
        tags: ["cgpa", "placement", "skills"],
        userId: priya._id,
        authorName: "priya_sharma",
        imageUrl: images.study,
        voteCount: 78,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "Is doing MBA after BTech worth it in 2025?",
        content: "I am finishing BTech in CS this year. Got a job offer of 4.5 LPA. My college seniors who did MBA from IIM are earning 20-25 LPA. But MBA costs 20-25 lakhs and 2 years. Is it worth it? Should I work for 2-3 years and then do MBA or go directly? Target is CAT.",
        category: "College",
        tags: ["mba", "iim", "cat", "btech"],
        userId: neha._id,
        authorName: "neha_finance",
        voteCount: 45,
        commentCount: 2,
        isAnonymous: false,
      },
      {
        title: "How to get an internship at a good company in 2nd year with no experience?",
        content: "I am in 2nd year CSE. I want to do a summer internship at a good product company or startup. But every internship posting says 'prior experience required'. This is a chicken-egg problem. I know basic Python and have made one project. Where should I apply? How?",
        category: "College",
        tags: ["internship", "secondyear", "experience"],
        userId: rohit._id,
        authorName: "rohit_college",
        voteCount: 63,
        commentCount: 3,
        isAnonymous: false,
      },

      // ── LIFE ──────────────────────────────────────────
      {
        title: "Moving to Bangalore alone at 22 — what should I know before going?",
        content: "I got my first job in Bangalore and will be moving from a small town in UP next month. I am completely alone there, no friends or family. I am nervous about finding PG, managing finances, dealing with the city alone. Any practical advice from people who have done this?",
        category: "Life",
        tags: ["bangalore", "relocating", "firstjob", "alone"],
        userId: vikram._id,
        authorName: "vikram_ops",
        imageUrl: images.life,
        voteCount: 83,
        commentCount: 3,
        isAnonymous: false,
      },
      {
        title: "How to deal with toxic manager at work without quitting the job?",
        content: "My manager takes credit for my work, never gives positive feedback and publicly humiliates me in team meetings. HR is useless here. I can't quit right now because I just joined 4 months ago and it will look bad on resume. How do I protect myself mentally and professionally?",
        category: "Life",
        tags: ["toxic", "manager", "workplace", "mentalhealth"],
        userId: priya._id,
        authorName: "priya_sharma",
        voteCount: 97,
        commentCount: 3,
        isAnonymous: true,
      },
      {
        title: "Feeling completely burnt out after 1 year of job — is this normal?",
        content: "I am 23, working at an IT company for 1 year. I used to love coding but now I dread opening my laptop. Working 10-12 hours daily, weekends too. Anxiety before Monday every Sunday night. Taking leaves but it doesn't help. I genuinely don't know if this is normal or if something is wrong.",
        category: "Life",
        tags: ["burnout", "mentalhealth", "it", "anxiety"],
        userId: arjun._id,
        authorName: "arjun_dev",
        voteCount: 134,
        commentCount: 3,
        isAnonymous: true,
      },
      {
        title: "Parents want me to get married at 24 but I want to focus on career — how to handle?",
        content: "I am 24, just started my career in finance. My parents have started showing me 'proposals'. I want to wait at least 3-4 more years. But they say 'log kya kahenge' and pressure is increasing. I don't want to hurt them but I am not ready. How do others handle this in Indian families?",
        category: "Life",
        tags: ["marriage", "family", "pressure", "career"],
        userId: neha._id,
        authorName: "neha_finance",
        voteCount: 119,
        commentCount: 3,
        isAnonymous: true,
      },
    ]);

    console.log(`✅ ${posts.length} posts created`);

    // ── COMMENTS ──────────────────────────────────────

    const commentsData = [

      // Post 0 — FAANG
      { postId: posts[0]._id, userId: vikram._id, authorName: "vikram_ops", content: "I cracked Amazon SDE-2 last year from a tier-2 college. Honest advice: FAANG from India is very possible but the path is long. Focus on DSA for at least 6 months — LeetCode medium/hard daily. Then do 2-3 strong projects with system design knowledge. Cold apply on LinkedIn to referrals, not just portals. Timeline realistic: 18-24 months of focused prep.", voteCount: 34, isSolution: true },
      { postId: posts[0]._id, userId: priya._id, authorName: "priya_sharma", content: "Don't ignore communication skills. Technical rounds are just 50% — behavioural rounds matter a lot especially at Google. Practice STAR method. Also apply to Google STEP and Amazon SDE internship programs — easier entry point from college.", voteCount: 12, isSolution: false },
      { postId: posts[0]._id, userId: neha._id, authorName: "neha_finance", content: "Competitive programming is not required for FAANG. LeetCode focused DSA prep is enough. Don't waste time on Codeforces unless you enjoy it. System design matters more for SDE-2 and above.", voteCount: 8, isSolution: false },

      // Post 1 — Docker vs K8s
      { postId: posts[1]._id, userId: arjun._id, authorName: "arjun_dev", content: "100% Docker first. You cannot understand Kubernetes without Docker fundamentals. Spend 3-4 weeks on Docker: images, containers, volumes, networking, docker-compose. Then Kubernetes will make sense. Also learn basic AWS (EC2, S3, ECS) in parallel. That combo is exactly what startups want.", voteCount: 28, isSolution: true },
      { postId: posts[1]._id, userId: rohit._id, authorName: "rohit_college", content: "Also don't forget CI/CD pipelines — GitHub Actions is easiest to start with. Most DevOps job descriptions expect you to know Docker + Kubernetes + at least one CI/CD tool. Add Terraform basics too if you have time.", voteCount: 9, isSolution: false },

      // Post 2 — React vs Next
      { postId: posts[2]._id, userId: vikram._id, authorName: "vikram_ops", content: "Learn React fundamentals first — components, hooks, state management with Zustand or Redux. Give it 6-8 weeks. Then Next.js will feel natural because it builds on top of React. If you jump to Next.js directly you will be confused why things work the way they do.", voteCount: 19, isSolution: true },
      { postId: posts[2]._id, userId: priya._id, authorName: "priya_sharma", content: "For full stack background, Next.js is actually perfect — it handles both frontend and backend in one project. App router + Server Actions is the modern way. But yes, understand React basics first. 2-3 weeks is enough.", voteCount: 7, isSolution: false },

      // Post 3 — GitHub dead
      { postId: posts[3]._id, userId: arjun._id, authorName: "arjun_dev", content: "Honestly most good recruiters don't care about GitHub activity streaks. What they look at is: quality of your pinned repos, README quality, and your resume projects. Start one solid project now — deploy it, write a good README, add it to resume. That matters 10x more than daily commits.", voteCount: 15, isSolution: true },
      { postId: posts[3]._id, userId: vikram._id, authorName: "vikram_ops", content: "Don't stress. I know engineers at top companies with 0 public GitHub contributions. What matters is what you build and how you explain it in the interview. Start now, that 6 month gap will become irrelevant in 3 months.", voteCount: 11, isSolution: false },

      // Post 4 — TCS vs Infosys
      { postId: posts[4]._id, userId: arjun._id, authorName: "arjun_dev", content: "None of them honestly, if your goal is product companies. But if you have to choose — Infosys has slightly better tech culture and their InfyTQ / Springboard platform actually has good learning content. Use whichever you join as a launchpad — give yourself max 18 months then start applying to product companies aggressively.", voteCount: 41, isSolution: true },
      { postId: posts[4]._id, userId: vikram._id, authorName: "vikram_ops", content: "TCS has the largest headcount which means more internal transfer options. If you are in a good project you can learn well. But the key is: don't get comfortable. Keep building skills outside office hours. The salary difference between these three is negligible.", voteCount: 18, isSolution: false },
      { postId: posts[4]._id, userId: neha._id, authorName: "neha_finance", content: "One thing to check — joining date and bond period. TCS has a 1-2 year bond with penalty. Factor that in before deciding. Otherwise negotiate joining bonus or ask about the tech stack you'll be working on.", voteCount: 9, isSolution: false },

      // Post 5 — Salary negotiation
      { postId: posts[5]._id, userId: vikram._id, authorName: "vikram_ops", content: "Companies almost never withdraw offers for polite negotiation — that is a myth. Email them: 'Thank you for the offer. I am very excited about this role. Based on my research and skillset I was expecting something closer to X. Is there flexibility?' Worst case they say no. Best case you get 10-20% more. Always try.", voteCount: 36, isSolution: true },
      { postId: posts[5]._id, userId: arjun._id, authorName: "arjun_dev", content: "Also negotiate non-salary components if base is fixed — joining bonus, extra annual leave, WFH days, learning budget. Many companies have flexibility here even when base is fixed.", voteCount: 14, isSolution: false },

      // Post 6 — 50 rejections
      { postId: posts[6]._id, userId: vikram._id, authorName: "vikram_ops", content: "50 rejections failing in technical rounds means one thing: interview performance anxiety or gaps in fundamentals. Record yourself solving problems out loud — most people blank out because they practice silently. Also do mock interviews on Pramp or interviewing.io. The problem is not your knowledge, it is how you communicate under pressure.", voteCount: 67, isSolution: true },
      { postId: posts[6]._id, userId: arjun._id, authorName: "arjun_dev", content: "Also review your past failed interviews. What specific topics keep coming up? System design? DP? Graphs? Identify the pattern and fix those specific gaps. 50 rejections = 50 data points. Use them.", voteCount: 23, isSolution: false },
      { postId: posts[6]._id, userId: priya._id, authorName: "priya_sharma", content: "Take a 2 week break if you are burnt out from rejections. Apply with fresh mind. Also update your resume — sometimes the ATS filter is rejecting you before human review. Use a clean simple format, no tables, no graphics.", voteCount: 15, isSolution: false },

      // Post 7 — Quit for startup
      { postId: posts[7]._id, userId: neha._id, authorName: "neha_finance", content: "3 validated clients is actually a strong signal. Most people quit with just an idea. My framework: if you have 3 paying clients or strong LOIs, 6+ months runway, and you would regret NOT trying more than failing — go for it. Life is long, 12 LPA will always be available to you after. The startup window might not be.", voteCount: 52, isSolution: true },
      { postId: posts[7]._id, userId: arjun._id, authorName: "arjun_dev", content: "Build on the side for 3 more months. Get one paying client. Then quit. That de-risks dramatically. 3 potential clients is not the same as 3 paying clients.", voteCount: 29, isSolution: false },

      // Post 8 — Invest 10k/month
      { postId: posts[8]._id, userId: neha._id, authorName: "neha_finance", content: "Simple 24-year-old playbook: First build 3 months emergency fund in a liquid fund. Then split your ₹10,000 like this — ₹5,000 in Nifty 50 index fund SIP (Zerodha Coin or Groww), ₹3,000 in PPF for tax saving, ₹2,000 in a mid-cap index fund for growth. Don't touch for 10 years. At 8-12% returns you'll have 2+ crore by 45.", voteCount: 58, isSolution: true },
      { postId: posts[8]._id, userId: priya._id, authorName: "priya_sharma", content: "Also get term insurance early — at 24 premiums are very cheap. ₹1 crore cover costs about ₹700-800/month. Don't mix insurance and investment, avoid ULIPs and endowment plans no matter what LIC agent says.", voteCount: 24, isSolution: false },
      { postId: posts[8]._id, userId: vikram._id, authorName: "vikram_ops", content: "Most importantly — increase your income. At 24 the best investment is in yourself. Upskill, get certifications, switch jobs every 2 years for salary hikes. A 50% salary jump invests more than any SIP optimization.", voteCount: 19, isSolution: false },

      // Post 9 — ITR filing
      { postId: posts[9]._id, userId: neha._id, authorName: "neha_finance", content: "Step by step for salaried with Form 16: 1) Go to incometax.gov.in, login with PAN. 2) File ITR, select ITR-1 (salaried). 3) Your Form 16 data is pre-filled, verify it. 4) Add deductions: 80C (PF + LIC + ELSS up to 1.5L), 80D (health insurance), HRA if applicable. 5) Verify with Aadhaar OTP. Done. Takes 20 mins if you have documents ready.", voteCount: 76, isSolution: true },
      { postId: posts[9]._id, userId: priya._id, authorName: "priya_sharma", content: "Deadline is July 31st. File before June 30th to avoid last minute portal crashes. Keep Form 16, rent receipts and investment proofs handy. If you have any confusion ClearTax or TaxBuddy offer free guided filing.", voteCount: 22, isSolution: false },
      { postId: posts[9]._id, userId: arjun._id, authorName: "arjun_dev", content: "One important thing — check Form 26AS and AIS before filing. These show tax already deducted. If there is any mismatch with Form 16 raise it with your employer first. Filing with wrong numbers can cause notice from IT department.", voteCount: 17, isSolution: false },

      // Post 10 — Buy vs rent Bangalore
      { postId: posts[10]._id, userId: neha._id, authorName: "neha_finance", content: "Pure math: Rent ₹25,000 vs EMI ₹65,000. That ₹40,000 difference invested in index funds at 12% for 20 years = ₹3.6 crore. The flat at 6% appreciation = ₹2.5 crore after 20 years. Renting wins financially in Bangalore at current valuations. Buy only if you are 100% sure you'll stay there 10+ years.", voteCount: 44, isSolution: true },
      { postId: posts[10]._id, userId: vikram._id, authorName: "vikram_ops", content: "Also factor in: maintenance charges, society fees, property tax, repairs. Real cost of owning is EMI + 15-20% more. At 28 in IT, your next job could be in a different city. Flexibility has real value.", voteCount: 18, isSolution: false },

      // Post 11 — Credit card
      { postId: posts[11]._id, userId: neha._id, authorName: "neha_finance", content: "Get one. Credit cards are tools — dangerous only without discipline. Golden rules: 1) Pay FULL amount before due date, never minimum. 2) Never use more than 30% of limit. 3) Set auto-debit for full payment. Best starter cards: HDFC Millennia or SBI SimplyCLICK — good cashback, no annual fee.", voteCount: 26, isSolution: true },
      { postId: posts[11]._id, userId: arjun._id, authorName: "arjun_dev", content: "Credit score matters a lot later for home loans and car loans. A credit card used responsibly for 2-3 years gives you a 750+ score. That can save you lakhs in lower interest rates later.", voteCount: 11, isSolution: false },

      // Post 12 — 1st year engineering
      { postId: posts[12]._id, userId: arjun._id, authorName: "arjun_dev", content: "Honest roadmap for 1st year: Learn one language well (Python or Java). Build one real project (not tutorial clones). Create LinkedIn and GitHub profiles. Attend at least 2 hackathons. Study enough to maintain 7+ CGPA. That's it. Don't overthink. Most important: build the habit of coding daily, even 30 mins.", voteCount: 89, isSolution: true },
      { postId: posts[12]._id, userId: vikram._id, authorName: "vikram_ops", content: "I would add: make friends with seniors who are doing well. Their shortcuts and guidance are priceless. And avoid people who waste your time in first year — college time is limited and very valuable.", voteCount: 34, isSolution: false },
      { postId: posts[12]._id, userId: neha._id, authorName: "neha_finance", content: "Don't start DSA in 1st year. Focus on basics of programming and one project. DSA grind in 2nd-3rd year is the right time. Too many 1st years burn out doing LeetCode before they even know OOP.", voteCount: 21, isSolution: false },

      // Post 13 — CGPA vs skills
      { postId: posts[13]._id, userId: vikram._id, authorName: "vikram_ops", content: "6.8 vs 7.0 is negligible in the real world. Yes some companies filter you out automatically — that is their loss. Many great product companies (startups, mid-size) do not have CGPA cutoffs. Focus on skills, projects and a strong portfolio. Those companies will be better work environments anyway.", voteCount: 55, isSolution: true },
      { postId: posts[13]._id, userId: arjun._id, authorName: "arjun_dev", content: "Apply to 7+ CGPA companies also — many portals don't have strict automated filters even if JD says 7.0. HR sometimes ignores it if your profile is strong. Worth trying.", voteCount: 19, isSolution: false },

      // Post 14 — MBA after BTech
      { postId: posts[14]._id, userId: neha._id, authorName: "neha_finance", content: "Work 2-3 years first, then MBA. Here is why: IIMs and top B-schools give much better placement to people with work experience. You'll also know which domain you want (tech management, consulting, finance). Freshers in MBA often don't know what they want and waste the degree.", voteCount: 38, isSolution: true },
      { postId: posts[14]._id, userId: priya._id, authorName: "priya_sharma", content: "CAT score matters but so does work experience for the interview stage. 2-3 years in a decent company gives you stories to tell. Also your ROI calculation should include opportunity cost of 2 years of salary + fees — make sure target salary post-MBA justifies it.", voteCount: 16, isSolution: false },

      // Post 15 — Internship 2nd year
      { postId: posts[15]._id, userId: arjun._id, authorName: "arjun_dev", content: "Best way to get first internship: 1) Build one decent project, deploy it, put it on GitHub. 2) Apply to startups on Internshala and LinkedIn — they don't care about experience. 3) Cold DM founders on LinkedIn with your project link. 4) Contribute to open source projects. One of these will work if you are persistent.", voteCount: 47, isSolution: true },
      { postId: posts[15]._id, userId: vikram._id, authorName: "vikram_ops", content: "Unstop and Internshala have many stipend internships for 2nd years. Also check your college alumni network — most seniors are happy to refer if you reach out properly. Don't mass spam, personalize each message.", voteCount: 21, isSolution: false },
      { postId: posts[15]._id, userId: rohit._id, authorName: "rohit_college", content: "I got my first internship by cold emailing 30 startups from LinkedIn with a one-page project portfolio. 28 no reply, 1 rejection, 1 yes. That 1 yes changed everything. Persistence is the skill.", voteCount: 33, isSolution: false },

      // Post 16 — Moving to Bangalore
      { postId: posts[16]._id, userId: vikram._id, authorName: "vikram_ops", content: "I moved alone at 22. Practical tips: 1) Book PG for first month only, explore areas once you are there. Koramangala, HSR, Bellandur are IT hubs. 2) Join Facebook groups for PG/flatmates. 3) Set budget strictly — Bangalore eats money fast. 4) Find one hobby group or community quickly — loneliness is real. 5) Keep 3 months expenses saved before joining.", voteCount: 64, isSolution: true },
      { postId: posts[16]._id, userId: arjun._id, authorName: "arjun_dev", content: "Download Dunzo, Swiggy, Rapido, Ola, PhonePe before you land. Get a local SIM if your number is from another state for some services. And seriously join LinkedIn meetups and tech community events — you'll make friends fast.", voteCount: 28, isSolution: false },
      { postId: posts[16]._id, userId: priya._id, authorName: "priya_sharma", content: "The first 3 months are the hardest. After that you'll wonder why you were scared. It's a rite of passage. Most people in Bangalore are from outside — everyone understands.", voteCount: 19, isSolution: false },

      // Post 17 — Toxic manager
      { postId: posts[17]._id, userId: priya._id, authorName: "priya_sharma", content: "Document everything — save emails, meeting notes, Slack messages where credit is taken. This protects you if things escalate. Meanwhile: build relationships with your manager's peers and skip-level. Make sure your work is visible to people beyond just your manager. And quietly start job search — toxic managers rarely change.", voteCount: 71, isSolution: true },
      { postId: posts[17]._id, userId: neha._id, authorName: "neha_finance", content: "Don't suffer silently thinking it will affect your resume to leave at 4 months. A toxic environment affects your mental health, your code quality, and your confidence long term. The resume gap explanation is much easier to handle than burnout.", voteCount: 35, isSolution: false },
      { postId: posts[17]._id, userId: vikram._id, authorName: "vikram_ops", content: "Try the skip-level approach first — most companies allow you to speak to your manager's manager. Frame it as 'seeking guidance' not 'complaining'. Document the conversation. Sometimes skip-level managers are unaware and do intervene.", voteCount: 22, isSolution: false },

      // Post 18 — Burnout
      { postId: posts[18]._id, userId: priya._id, authorName: "priya_sharma", content: "What you are describing is textbook burnout, not weakness. It is extremely common in Indian IT. Steps that helped me: 1) Talk to your manager about realistic workload — most won't fire you for being honest. 2) Take a proper 1 week leave with no laptop. 3) Add one non-screen activity daily (walk, gym, cooking). 4) If anxiety persists talk to a therapist — BetterHelp and YourDOST have good Indian options.", voteCount: 98, isSolution: true },
      { postId: posts[18]._id, userId: arjun._id, authorName: "arjun_dev", content: "Also check: are you in the wrong company or the wrong career? Sometimes burnout is your brain telling you something important. Not every person is suited for corporate IT grind. It is okay to explore other paths.", voteCount: 42, isSolution: false },
      { postId: posts[18]._id, userId: vikram._id, authorName: "vikram_ops", content: "Sunday anxiety (Sunday scaries) is a clear sign the job is wrong for you, not just the workload. Life is too short for dreading Mondays at 23. Start looking for a new role in parallel while recovering.", voteCount: 31, isSolution: false },

      // Post 19 — Marriage pressure
      { postId: posts[19]._id, userId: neha._id, authorName: "neha_finance", content: "Have one calm honest conversation with your parents (not an argument). Tell them: 'I respect your concern and I do want to get married. I want to be financially stable first so I can give my family the life they deserve. Give me 2 years.' Parents respond better to responsibility framing than independence framing. Also tell them a specific timeline — vagueness creates more pressure.", voteCount: 87, isSolution: true },
      { postId: posts[19]._id, userId: priya._id, authorName: "priya_sharma", content: "You are not alone. This is a very common situation for Indian 20-somethings. The pressure peaks at 24-26 and usually reduces when they see you are stable and happy. Hold your ground kindly but firmly. Your life, your timeline.", voteCount: 45, isSolution: false },
      { postId: posts[19]._id, userId: arjun._id, authorName: "arjun_dev", content: "Log kya kahenge is not a valid life plan. The people talking will not pay your EMIs or live your life. Politely but firmly set your own timeline. Most parents come around when they see you are doing well.", voteCount: 38, isSolution: false },
    ];

    const comments = await Comment.insertMany(commentsData);
    console.log(`✅ ${comments.length} comments created`);

    // Set solution comments on posts
    const solutionMap = {
      0: comments[0]._id,   // FAANG
      1: comments[3]._id,   // Docker
      2: comments[5]._id,   // React
      3: comments[7]._id,   // GitHub
      4: comments[9]._id,   // TCS
      5: comments[12]._id,  // Salary
      6: comments[14]._id,  // Rejections
      7: comments[17]._id,  // Startup
      8: comments[19]._id,  // Invest
      9: comments[22]._id,  // ITR
      10: comments[25]._id, // Buy vs rent
      11: comments[27]._id, // Credit card
      12: comments[29]._id, // 1st year
      13: comments[32]._id, // CGPA
      14: comments[34]._id, // MBA
      15: comments[36]._id, // Internship
      16: comments[39]._id, // Bangalore
      17: comments[42]._id, // Toxic manager
      18: comments[45]._id, // Burnout
      19: comments[48]._id, // Marriage
    };

    for (const [i, commentId] of Object.entries(solutionMap)) {
      await Post.updateOne({ _id: posts[i]._id }, { solutionCommentId: commentId });
    }
    console.log("✅ Solutions marked");

    // Update comment counts
    for (const post of posts) {
      const count = await Comment.countDocuments({ postId: post._id });
      await Post.updateOne({ _id: post._id }, { commentCount: count });
    }
    console.log("✅ Comment counts updated");

    console.log("\n🎉 SEED COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`👥 Users: ${users.length}`);
    console.log(`📝 Posts: ${posts.length}`);
    console.log(`💬 Comments: ${comments.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔑 Login credentials:");
    console.log("Email: arjun@gmail.com | Password: password123");
    console.log("Email: priya@gmail.com | Password: password123");
    console.log("Email: vikram@gmail.com | Password: password123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
