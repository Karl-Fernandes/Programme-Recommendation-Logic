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
  'Pre-University': "As a high school student, every opportunity you are eligible for will be listed on the Pre-University tab.",
  'Spring Weeks': "As you are two years away from graduating, every opportunity you are eligible for will be listed on the Spring Weeks tab. This includes a handful of summer internships open for all students.",
  'Spring Weeks More Than 2': "As you are not two years out from graduation, you are technically not eligible for Spring Weeks. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for Spring Weeks with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for Spring Weeks, and switch back after your spring weeks if you choose to continue with your industrial placement degree.",
  'Industrial Placements': "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
  'Industrial Placements Early Years': "As a first-year student interested in placements, you should focus on building foundational skills and experiences. While it's early to apply for placements directly, you can prepare by researching companies, improving your CV, and gaining relevant experiences through societies or projects. You'll be in a stronger position to apply for placements in your second year.",
  'Off-Cycle Internships': "It is also possible to fill your industrial placement year with 2 off-cycle internships. However, these programmes are far more competitive and securing two internships that align in timing will be challenging.",
  'Off-Cycle Internships Grad No Exp': "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for graduate programmes at less competitive companies.",
  'Summer Internships': "As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer.",
  'Graduate Schemes': "Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. Although more competitive, it would be safer to continue applying for other graduate programmes.",
  'Final Year No Offer Exp': "Because you have previous experience, you will be a strong candidate for off-cycle internships. These programmes have less applicants and are suitable for upcoming graduates, often converting to a full-time position.",
  'Final Year No Offer No Exp': "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer. Because you have no relevant experience, applying for summer internships will give you the best chance of receiving an offer",
  'Graduated Exp': "Because you have relevant experience, you have the opportunity to pass CV screening for off-cycle internships which are typically unattainable for those without past internships.",
  'Graduated Exp Secondary': "You are also eligible for graduate schemes but, even for students with relevant experience, these are unrealistically competitive. These are good options for less competitive companies or back office divisions, but prioritise off-cycle internships for more competitive roles.",
  'Graduated No Exp': "Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or divisions such as Big 4, or risk/operations at banks as these are often attainable for candidates with no experience.",
  'Summer Internships Masters Backup': "You can become eligible for Spring Weeks by writing \"Intended Master's Degree\" on your resume. These serve as a less competitive route into great roles, and act as a backup option in case you fail to convert your summer internship this year. Many companies will not force you to complete the Master's Degree but even if they do, it will often be a favourable outcome regardless.",
  'Summer Internships Masters Final Year': "You can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer.",
  'Off-Cycle Internships Final Year': "If you are deeply unsatisfied with your current graduate offer, you can apply for off-cycle internships. These programmes are less competitive and often convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer.",
  'Summer Internships Final Year Experience': "You can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer.",
  'Graduate Schemes Final Year Experience': "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for less competitive companies, but prioritise off-cycle internships and summer internships.",
  'Graduate Schemes Final Year No Experience': "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for smaller or less competitive companies, but prioritise summer internships for the most competitive roles.",
  'Off-Cycle Internships Final Year No Experience': "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for summer internships.",
  'Industrial Placements Later Year': "Although placements are typically completed after your second year, some companies offer flexible placement opportunities for later-year students. Consider reaching out directly to companies to inquire about placement possibilities aligned with your experience level.",
  
  // Technology-specific commentary
  'Tech Pre-University': "Unfortunately we don’t cover technology programmes for students who are still in school. Continue building as much experience as you can, and come back to apply to insight programmes when you begin your first year of university.",
  'Tech Insight Programmes': "As you are two years away from graduating, every opportunity you are eligible for will be listed on the Insight Programmes tab. This includes a handful of summer internship open for all students.",
  'Tech Insight Programmes More Than 2': "As you are not two years out from graduation, you are technically not eligible for many insight programmes. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for insight programmes with no issues. You can always switch back to an Integrated Master's if you change your mind. ",
  'Tech Industrial Placements More Than 2': "As you are not two years out from graduation, you are technically not eligible for many insight programmes. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for insight programmes with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for insight programmes, and switch back after if you choose to continue with your industrial placement degree.",
  'Tech Industrial Placements': "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
  'Tech Industrial Placements Early Years': "As a first-year student interested in placements, you should focus on building foundational skills and experiences. While it's early to apply for placements directly, you can prepare by researching companies, improving your CV, and gaining relevant experiences through societies or projects. You'll be in a stronger position to apply for placements in your second year.",
  'Tech Off-Cycle Internships': "It is also possible to fill your industrial placement year with 2 off-cycle internships. However, these programmes are far more competitive and securing two internships that align in timing will be challenging.",
  'Tech Off-Cycle Internships Grad No Exp': "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for graduate programmes at less competitive companies.",
  'Tech Summer Internships': "As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer.",
  'Tech Graduate Schemes': "Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. Although more competitive, it would be safer to continue applying for other graduate programmes.",
  'Tech Final Year No Offer Exp': "Graduate programmes are competitive for most roles in tech, but are still achievable. These are great opportunities to enter a job directly, instead of needing to complete an internship at the company first",
  'Tech Final Year No Offer No Exp': "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer. Because you have no relevant experience, applying for summer internships will give you the best chance of receiving an offer",
  'Tech Graduated Exp': "Because you have relevant experience, you have the opportunity to pass CV screening for off-cycle internships which are typically unattainable for those without past internships.",
  'Tech Graduated No Exp': "Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or divisions such as Big 4, or risk/operations at banks as these are often attainable for candidates with no experience.",
  'Tech Summer Internships Masters Backup': "You can become eligible for Insight Programmes by writing \"Intended Master's Degree\" on your resume. These serve as a less competitive route into great roles, and act as a backup option in case you fail to convert your summer internship this year. Many companies will not force you to complete the Master's Degree but even if they do, it will often be a favourable outcome regardless.",
  'Tech Summer Internships Masters Final Year': "You can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer.",
  'Tech Off-Cycle Internships Final Year': "If you are deeply unsatisfied with your current graduate offer, you can apply for off-cycle internships. These programmes are less competitive and often convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer.",
  'Tech Summer Internships Final Year Experience': "You can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer.",
  'Tech Graduate Schemes Summer Internship': "If you are deeply unsatisfied with your current graduate offer, you can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer. Most firms will not force you to complete a Master's Degree.",
  'Tech Graduate Schemes Final Year Experience': "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for less competitive companies, but prioritise off-cycle internships and summer internships.",
  'Tech Graduate Schemes Final Year No Experience': "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for smaller or less competitive companies, but prioritise summer internships for the most competitive roles.",
  'Tech Off-Cycle Internships Final Year No Experience': "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for summer internships.",
  'Tech Industrial Placements Later Year': "Although placements are typically completed after your second year, some companies offer flexible placement opportunities for later-year students. Consider reaching out directly to companies to inquire about placement possibilities aligned with your experience level.",
  
  // Law-specific commentary  
  'Law Pre-University': "As a high school student interested in law, focus on developing strong analytical and communication skills. Consider participating in debate societies and exploring different areas of law through work experience.",
  'Law Spring Weeks': "Law firms offer vacation schemes rather than traditional spring weeks. These are typically 1-2 weeks and provide insight into different practice areas. Competition is intense, so apply early and broadly.",
  'Law Summer Internships': "Legal internships (vacation schemes) are the primary route into training contracts. Most magic circle and top-tier firms recruit trainees almost exclusively through their vacation schemes.",
  'Law Graduate Schemes': "Training contracts are the standard route into qualified legal practice. Competition is extremely fierce, with some firms receiving 2000+ applications for 20-30 places. Consider alternative routes like paralegal roles.",
  'Law Industrial Placements': "Legal placements are less common than other sectors, but some firms offer longer-term paralegal positions or legal internships that can provide valuable experience.",
  'Law Off-Cycle Internships': "Legal internships typically follow set recruitment cycles. However, smaller firms and in-house legal teams may offer more flexible timing. Consider expanding your search beyond traditional law firms."
} as const;

export type EducationStage = typeof EDUCATION_STAGES[keyof typeof EDUCATION_STAGES];
export type Sector = typeof SECTORS[keyof typeof SECTORS];
export type StepType = typeof STEP_TYPES[keyof typeof STEP_TYPES];
export type CommentaryKey = keyof typeof COMMENTARY_TEXTS;

// Function to get commentary text
export function getCommentaryText(key: CommentaryKey): string {
  return COMMENTARY_TEXTS[key];
}
