export const EDUCATION_STAGES = {
  HIGH_SCHOOL: 'high school',
  UNIVERSITY: 'university',
  GRADUATE: 'graduate'
} as const;

export const SECTORS = {
  TECH: 'Technology',
  LAW: 'Law',
  FINANCE: 'Finance'
} as const;

export const STEP_TYPES = {
  WELCOME: 0,
  SECTOR: 1,
  EDUCATION_STAGE: 2,
  UNIVERSITY_TIMELINE: 3,
  SPRING_WEEKS: 4,
  SPRING_CONVERSION: 5,
  INTERNSHIP_EXPERIENCE: 'internship_experience',
  GRAD_OFFER: 'grad_offer',
  FINAL: 'final'
} as const;

export const COMMENTARY_TEXTS = {
  // Finance-specific commentary (current default)
  "Finance High School": "As a high school student, every opportunity you are eligible for will be listed on the Pre-University tab.",
  "Finance More Than Two Years Out Spring": "As you are not two years out from graduation, you are technically not eligible for Spring Weeks. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for Spring Weeks with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for Spring Weeks, and switch back after your spring weeks if you choose to continue with your industrial placement degree",
  "Finance First Year Industrial Placement": "As a first-year student interested in placements, you should focus on building foundational skills and experiences. While it's early to apply for placements directly, you can prepare by researching companies, improving your CV, and gaining relevant experiences through societies or projects. You'll be in a stronger position to apply for placements in your second year.",
  "Finance Two Years Out Spring": "As you are two years away from graduating, every opportunity you are eligible for will be listed on the Spring Weeks tab. This includes a handful of summer internships open for all students.",
  "Finance Two Years Out Industrial Placement": "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
  "Finance Two Years Out Off-Cycle Internship": "It is also possible to fill your industrial placement year with 2 off-cycle internships. However, these programmes are far more competitive and securing two internships that align in timing will be challenging.",
  "Finance Penultimate Summer Internship": "As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer.",
  "Finance Penultimate Spring Week": "You can become eligible for Spring Weeks by writing 'Intended Master's Degree' on your resume. These serve as a less competitive route into great roles, and act as a backup option in case you fail to convert your summer internship this year. Many companies will not force you to complete the Master's Degree but even if they do, it will often be a favourable outcome regardless.",
  "Finance Final Year Grad Offer Grad Scheme": "Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. Although more competitive, it would be safer to continue applying for other graduate programmes.",
  "Finance Final Year Grad Offer Summer Internship": "If you are deeply unsatisfied with your current graduate offer, you can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer. Most firms will not force you to complete a Master's Degree.",
  "Finance Final Year Grad Offer Off-Cycle Internship": "If you are deeply unsatisfied with your current graduate offer, you can apply for off-cycle internships. These programmes are less competitive and often convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer",
  "Finance Final Year With Exp Off-Cycle Internship": "Because you have previous experience, you will be a strong candidate for off-cycle internships. These programmes have less applicants and are suitable for upcoming graduates, often converting to a full-time position.",
  "Finance Final Year With Exp Summer Internship": "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer.",
  "Finance Final Year With Exp Grad Scheme": "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for less competitive companies, but prioritise off-cycle internships and summer internships.",
  "Finance Final Year No Exp Summer Internship": "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer. Because you have no relevant experience, applying for summer internships will give you the best chance of receiving an offer",
  "Finance Final Year No Exp Grad Scheme": "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for smaller or less competitive companies, but prioritise summer internships for the most competitive roles.",
  "Finance Final Year No Exp Off-Cycle Internship": "You are eligible for off-cycle internships, but these these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for summer internships.",
  "Finance Grad With Exp Off-Cycle Internship": "Because you have relevant experience, you have the opportunity to pass CV screening for off-cycle internships which are typically unattainable for those without past internships.",
  "Finance Grad With Exp Grad Scheme": "You are also eligible for graduate schemes but, even for students with relevant experience, these are unrealistically competitive. These are good options for less competitive companies or back office divisions, but prioritise off-cycle internships for more competitive roles.",
  "Finance Grad No Exp Grad Scheme":  "Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or divisions such as Big 4, or risk/operations at banks as these are often attainable for candidates with no experience.",
  "Finance Grad No Exp Off-Cycle Internship": "You are eligible for off-cycle internships, but these these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for graduate programmes at less competitive companies.",

  "Tech High School": "Unfortunately we don’t cover technology programmes for students who are still in school. Continue building as much experience as you can, and come back to apply to insight programmes when you begin your first year of university.",
  "Tech More Than Two Years Out Spring": "As you are not two years out from graduation, you are technically not eligible for Insight programmes. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for Insight Programmes with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for Insight Programmes, and switch back after your Insight Programme if you choose to continue with your industrial placement degree.",
  "Tech Two Years From Grad": "As you are two years away from graduating, every opportunity you are eligible for will be listed on the Insight Programmes tab. This includes a handful of summer internships open for all students.",
  "Tech Two Years Out Industrial Placement": "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
  "Tech Penultimate Summer Internship": "As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer.",
  "Tech Penultimate Spring Week": "You can become eligible for Insight Programmes by writing 'Intended Master's Degree' on your resume. These serve as a less competitive route into great roles, and act as a backup option in case you fail to convert your summer internship this year. Many companies will not force you to complete the Master's Degree but even if they do, it will often be a favourable outcome regardless.",
  "Tech Final Year Grad Offer Grad Scheme": "Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. Although more competitive, it would be safer to continue applying for other graduate programmes.",
  "Tech Final Year Grad Offer Summer Internship": "If you are deeply unsatisfied with your current graduate offer, you can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer. Most firms will not force you to complete a Master's Degree.",
  "Tech Final Year Grad Scheme": "Graduate programmes are competitive for most roles in tech, but are still achievable. These are great opportunities to enter a job directly, instead of needing to complete an internship at the company first.",
  "Tech Final Year Summer Internship": "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer.",
  "Tech Grad Exp Grad Scheme": "Because you have relevant experience, you may be well placed for more competitive graduate schemes at many of the top technology companies, or technology roles within large financial services organisations. Remember, even with relevant experience graduate schemes are highly competitive, so it is important that you apply early and apply to as many as possible to maximise your chance of success.",
  "Tech Grad No Exp Grad Scheme": "Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or in less technical divisions such as IT, QA testing, or internal tools teams. You might also consider roles at larger consulting firms like the Big 4, or technology analyst/operations roles at corporates or banks, as these are often more accessible for candidates without prior experience.",


  "Law High School": "Unfortunately we don’t cover law programmes for students who are still in school. Continue building as much experience as you can, and come back to apply to first year schemes when you begin your first year of university.",
  "Law More Than Two Years Out FYP": "As you are not two years out from graduation, you are technically not eligible for Insight programmes. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for First Year Schemes with no issues. You can always switch back to an Integrated Master's if you change your mind.",
  "Law Two Years Out FYP": "As you are two years away from graduating, every opportunity you are eligible for will be listed on the First Year Programmes tab. This includes a handful of internships open for all students.",
  "Law Penultimate Vacation": "As a penultimate-year student, Vacation Schemes are the ideal opportunity to gain experience and receive a training contract.",
  "Law Penultimate Non-Law Internships": "Applying to non-law internships can be a smart move, especially in the penultimate year of university. These roles help build transferable skills like research, communication, and commercial awareness, all of which are highly valued by law firms. Gaining legal experience in sectors like finance, consulting, or tech also broadens your perspective and makes your applications stand out in a competitive legal recruitment process.",
  "Law Final Year Training Contracts": "Applying to training contracts in your final year of university aligns perfectly with law firms’ recruitment cycles, allowing you to secure a role before graduation. Many firms recruit up to two years in advance, so applying now gives you the best chance to lock in a position and focus on your studies without added pressure. It also avoids the risk of missing deadlines and being left waiting an extra year to reapply.",
  "Law Final Year Vacation": "Applying to vacation schemes in your final year can still be highly beneficial, especially if you haven’t secured a training contract yet. Many firms use vacation schemes as the primary route to offering training contracts, so completing one gives you a valuable chance to prove yourself directly to employers.",
  "Law Grad Training Contracts": "As you’ve already graduated, applying for training contracts is the next logical step. Most firms recruit up to two years in advance, so applying early allows you to secure a position while you complete any required legal studies, such as the GDL or SQE preparation. Delaying your application can push back your qualification timeline unnecessarily, so applying now helps you stay on track."
}

export type EducationStage = typeof EDUCATION_STAGES[keyof typeof EDUCATION_STAGES];
export type Sector = typeof SECTORS[keyof typeof SECTORS];
export type StepType = typeof STEP_TYPES[keyof typeof STEP_TYPES];
export type CommentaryKey = keyof typeof COMMENTARY_TEXTS;

// Function to get commentary text
export function getCommentaryText(key: CommentaryKey): string {
  return COMMENTARY_TEXTS[key];
}
