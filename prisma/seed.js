const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const awards = [
  {
    title: "Best Academic Performer Award",
    description: "For students with excellent academic performance.",
    criteria: "1. Students with excellent academic performance\n2. First-attempt pass in all subjects\n3. Satisfactory attendance\n4. Good disciplinary record are eligible."
  },
  {
    title: "Best Coder Award",
    description: "For students with strong coding and problem-solving skills.",
    criteria: "1. College students with strong coding and problem-solving skills.\n2. Regular practice on coding platforms (e.g., LeetCode, HackerRank, CodeChef)\n3. Winners or prize holders in outside coding contests/hackathons\n4. Completed coding projects or technical applications\n5. Good academic standing and disciplinary record"
  },
  {
    title: "Best Researcher Award",
    description: "For students with research publications and patents.",
    criteria: "1. Students with Maximum research publications in indexed / peer-reviewed journals or conference proceedings\n2. Received best paper award/ best project award\n3. Filed or granted patents (individual or joint authorship)\n4. Good academic standing and disciplinary record"
  },
  {
    title: "Best Continuous Learner Award",
    description: "For students completing online certification courses.",
    criteria: "1. Student must have successfully completed maximum online certification courses.\n2. Received NPTEL achievers award.\n3. Courses should be completed in consecutive semesters/academic years."
  },
  {
    title: "Best Hackathon team Award",
    description: "For teams demonstrating innovation in hackathons.",
    criteria: "1. Team must have participated in a recognized hackathon.\n2. Project should demonstrate innovation, technical excellence, and problem-solving.\n3. Team must have completed and presented a working solution/prototype.\n4. Proof of participation/achievement must be submitted."
  },
  {
    title: "Best Placement Achiever (Final year students only)",
    description: "For final year students placed in reputed companies.",
    criteria: "1. Student must be placed in a reputed company with a high salary package.\n2. Placement can be through on-campus or off-campus recruitment.\n3. Offer letter proof mentioning company name and package must be submitted.\n4. Student should be a final-year graduate of the institution."
  },
  {
    title: "Best Volunteer/Organizer/Team player",
    description: "For students actively contributing to college events.",
    criteria: "1. Actively contributed to college events, activities, or initiatives.\n2. Played a key role in organizing, coordinating, or supporting events.\n3. Demonstrated leadership, responsibility, and commitment.\n4. Showed excellent teamwork, cooperation, and communication skills.\n5. Contributed beyond assigned roles for successful event execution.\n6. Proof of involvement and faculty endorsement must be submitted."
  },
  {
    title: "Best Entertainer Award",
    description: "For students with outstanding talent in cultural activities.",
    criteria: "1. Actively participated in cultural and extracurricular activities during the academic year\n2. Demonstrated outstanding talent in areas such as dance, music, drama, mimicry, anchoring, or fine arts\n3. Consistently engaged in college events, fests, celebrations, and competitions\n4. Showed creativity, stage presence, and the ability to engage and entertain the audience\n5. Represented the institution in inter-college / university-level cultural events (preferred)\n6. Maintained good conduct and academic eligibility as per college norms"
  },
  {
    title: "Best Entrepreneurial award",
    description: "For students involved in startups or entrepreneurial ventures.",
    criteria: "1. Initiated or actively involved in a startup, business, or entrepreneurial venture during the academic year\n2. Actively participated in entrepreneurship-related activities (E-Cell events, startup competitions, idea pitching, incubation programs, etc.)\n3. Maintained good academic standing and discipline as per college norms"
  },
  {
    title: "Best Rising talent award (First year only)",
    description: "For First Year students demonstrating exceptional talent.",
    criteria: "1. Applicable only to First Year students\n2. Demonstrated exceptional talent and rapid improvement in academics, technical, cultural, sports, or extracurricular activities\n3. Actively participated in college events, competitions, or programs during the first year\n4. Showed enthusiasm, discipline, and commitment to skill development\n5. Exhibited strong potential for future excellence and leadership"
  },
  {
    title: "Best Sports Performer Award",
    description: "For active participation and achievement in sports.",
    criteria: "1. Actively participated in college sports activities during the academic year\n2. Represented the institution in intra-college / inter-college / university / state / national level events\n3. Achieved notable performance, awards, or consistent contribution in sports"
  },
  {
    title: "Best Project Award(Final years only)",
    description: "For Final Year students with outstanding academic/technical projects.",
    criteria: "1. Successfully completed a final-year academic/technical project\n2. Demonstrated originality, innovation, and depth of understanding\n3. Practical relevance and effective problem-solving approach\n4. Quality of design, implementation, testing, and results\n5. Clear documentation, presentation, and project demonstration\n6. Individual contribution clearly defined (for team projects)"
  },
  {
    title: "Best Outgoing Student of the year Award",
    description: "For final year students with consistent performance and leadership.",
    criteria: "1. Demonstrated consistent academic performance\n2. Actively participated in co-curricular and extracurricular activities (technical, cultural, sports, clubs, etc.)\n3. Showed leadership qualities, initiative, and teamwork\n4. Contributed positively to department/college activities and events\n5. Exhibited discipline, good conduct, and responsibility\n6. Balanced academics with overall personality development"
  },
  {
    title: "Breaking the Barrier Award",
    description: "For students balancing academics with work responsibilities.",
    criteria: "1. Student who works/has worked part-time to support their education\n2. Successfully balances academics with work responsibilities\n3. Demonstrates perseverance, self-discipline, and determination\n4. Maintains regular attendance and satisfactory academic progress\n5. Exhibits strong character, integrity, and positive attitude"
  },
  {
    title: "Best Social Impact through Technology Award",
    description: "For students creating social impact through technology.",
    criteria: "1. Conducted workshops or sessions to educate school students on technology\n2. Developed and deployed disaster management or safety-related applications\n3. Created technical solutions that address specific local community problems\n4. Active involvement in tech-driven social initiatives or awareness campaigns"
  }
];

async function main() {
  console.log('Start seeding...');
  for (const award of awards) {
    const existing = await prisma.award.findFirst({
      where: { title: award.title }
    });

    if (!existing) {
      const createdAward = await prisma.award.create({
        data: award,
      });
      console.log(`Created award with id: ${createdAward.id}`);
    } else {
      console.log(`Award "${award.title}" already exists. Skipping.`);
    }
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
