/* Verified personal and academic content. */
window.SITE_DATA = {
  profile: {
    name: 'Simone Pedico', brand: 'SIMONE PEDICO / PERSONAL PAGE', shortRole: 'Geometry Processing · Machine Learning · Computer Vision',
    title: 'PhD Student in Computer Science — Geometry Processing and Generative 3D',
    headline: ['PhD student, Computer Science.', '“We used to look up at the sky', 'and wonder at our place in the stars.”'],
    bio: 'First-year PhD student at the University of Milano-Bicocca (3DiG Lab), working on geometry processing and computer vision, with a focus on matching, mesh generation and 4D reconstruction.',
    affiliation: 'University of Milano-Bicocca',
    aboutTitle: 'About me.',
    about: 'I am a first-year PhD student at the University of Milano-Bicocca, where I also obtained my Bachelor’s and Master’s degrees in Computer Science. I work under the supervision of Prof. Simone Melzi at the 3DiG Lab. My research interests are mainly in geometry processing and computer vision, with a focus on matching problem, mesh generation, and 4D tracking and reconstruction. I am also interested in 3D art and rendering. As part of my academic work, I also participated in a project on constrained AI, using neuro-symbolic constraints to predict the future positions of skeletal joints in meshes.',
    photo: 'assets/profile.PNG', photoAlt: 'Abstract profile illustration',
    interests: ['Geometry Processing', 'Shape Correspondence', '3D Generation', 'Machine Learning', 'Mesh Generation', '4D Tracking'],
    cv: null, email: 'pedico.simone@gmail.com', emailLabel: 'pedico.simone@gmail.com',
    socials: [
      {label: 'Google Scholar', url: 'https://scholar.google.com/citations?hl=it&user=U2qrt8wAAAAJ&view_op=list_works&authuser=1&gmla=AN_4Zu91U2gOKiRMZU_BvnGSLW3lVtwke8qcDmyzUkmjtSq8qycBKbQBPe3tmURz4HZbEYHIE1y9Bl-v5nKymHpwebhc'},
      {label: 'LinkedIn', url: 'https://www.linkedin.com/in/simone-pedico-092902331/'},
      {label: 'GitHub', url: 'https://github.com/simonepedico'}
    ],
    contactTitle: 'Good research starts\nwith a conversation.',
    address: 'Department of Informatics, Systems and Communication (DISCo)\nU14 – ABACUS Building\nViale Sarca, 336 · 20125 Milano',
    mapsURL: 'https://www.google.com/maps/search/?api=1&query=U14%20ABACUS%2C%20Viale%20Sarca%20336%2C%2020125%20Milano',
    footerNote: '',
    publicationIntro: 'Peer-reviewed work on shape correspondence and geometric data.'
  },
  news: [],
  publications: [
    {
      id: 'taco-2024', year: 2024, topic: 'Shape Correspondence',
      title: 'TACO: a Benchmark for Connectivity-invariance in Shape Correspondence',
      authors: ['Simone Pedico', 'Simone Melzi', 'Filippo Maggioli'],
      venue: 'STAG 2024',
      summary: 'Introduces a shape correspondence benchmark in which meshes of the same subject across poses have different connectivity, with new ground-truth correspondences. The benchmark evaluates how altered connectivity affects state-of-the-art shape-matching methods.',
      thumbnail: 'assets/taco.png', imageAlt: 'TACO diagram comparing shape correspondence with connectivity-preserving and remeshed meshes', imageFit: 'contain',
      pdf: 'https://boa.unimib.it/retrieve/9975a671-8d9c-40e8-b70b-990ec45d4630/Pedico%20et%20al-2024-STAG-VoR.pdf',
      links: {Paper: 'https://boa.unimib.it/handle/10281/558432', DOI: 'https://doi.org/10.2312/stag.20241344'},
      bibtex: "@inproceedings{pedico2024taco,\n  title={TACO: a Benchmark for Connectivity-invariance in Shape Correspondence},\n  author={Pedico, Simone and Melzi, Simone and Maggioli, Filippo},\n  booktitle={Eurographics Italian Chapter Proceedings - Smart Tools and Applications in Graphics},\n  year={2024},\n  doi={10.2312/stag.20241344}\n}"
    }
  ],
  projects: [
    {label: 'MASTER’S THESIS', title: 'Geometric information for single-view mesh generation', authors: ['Simone Pedico'], description: 'Extends Human3Diffusion to take depth and normal maps alongside the RGB image (7-channel input). Maps are estimated with Marigold, post-processed to match the training data, and the model is fine-tuned on a custom dataset to measure the impact on mesh quality.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/master_thesis/mesh_generation_thesis.pdf', cardUrl: 'https://github.com/simonepedico/Personal_Projects/blob/main/master_thesis/readme.md', linkLabel: 'Read the thesis'},
    {label: 'BACHELOR’S THESIS', title: 'Shape correspondence with non connectivity-preserving remeshing', authors: ['Simone Pedico'], description: 'Builds a dataset in which meshes of the same subject have different connectivity, so matching cannot rely on recurring triangle patterns, and measures the impact on correspondence accuracy. This work led to TACO, presented at STAG 2024.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/bachelor_thesis/tosca_remesh_thesis.pdf', cardUrl: 'https://github.com/simonepedico/Personal_Projects/blob/main/bachelor_thesis/readme.md', linkLabel: 'Read the thesis'},
    {label: 'NEURO-SYMBOLIC AI', title: 'Reliability and explainability in PINPOINT', description: 'Compares a standard neural network with a relational neuro-symbolic Markov model for predicting the next frame of human skeletal animations (SURREAL, 24 joints). Symbolic constraints such as joint connectivity, range-of-motion limits and limb symmetry inject prior knowledge directly into training; preliminary results suggest better predictions.', authors: ['Simone Pedico'], url: null, linkLabel: ''},
    {label: 'DEEP LEARNING', title: 'Human age prediction', authors: ['Davide Piatti', 'Simone Pedico', 'Valentyn Piskovskyi'], description: 'Age regression from facial images comparing transfer learning, multi-task learning and self-supervised learning, then averaging the three into an ensemble that improves every reported metric.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/human_age_prediction/readme.md', linkLabel: 'View on GitHub'},
    {label: 'MACHINE LEARNING', title: 'Fetal health prediction', authors: ['Simone Pedico', 'Davide Piatti', 'Amedeo Desantis'], description: 'Three-class classification of cardiotocography measurements, comparing feed-forward neural networks with small interpretable decision trees and studying class imbalance, PCA and model complexity.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/fetal_health_prediction/readme.md', linkLabel: 'View on GitHub'},
    {label: 'INFORMATION RETRIEVAL', title: 'TG3E: historical retrieval for 19th-century newspapers', authors: ['Simone Pedico', 'Valentyn Piskovskyi'], description: 'A retrieval system for historical newspapers comparing TF-IDF, BM25, PL2 and DLH13, plus DLH13 variants with lemmatization, geographic expansion and named entities, evaluated with MAP, precision, recall and nDCG.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/TG3E/readme.md', linkLabel: 'View on GitHub'},
    {label: 'CAUSAL INFERENCE', title: 'Causal effects of canopy management', authors: ['Simone Pedico'], description: 'A structural causal model of how canopy-management treatments affect Sangiovese grapes, using regression-based g-computation to answer six queries on total, direct and mediated effects.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/Causal_effect_of_canopy_management/readme.md', linkLabel: 'View on GitHub'},
    {label: 'DIGITAL DESIGN', title: 'Moving average filter', authors: ['Simone Pedico', 'Davide Piatti'], description: 'A modular VHDL moving-average filter built from a FIFO, arithmetic logic, an accumulator and a power-of-two division stage, with component and file-driven testbenches.', url: 'https://github.com/simonepedico/Personal_Projects/blob/main/moving_average_filter/readme.md', linkLabel: 'View on GitHub'}
  ],
  service: [],
  scene: {maxPixelRatio: 1.7, desktopSegments: 128, mobileSegments: 64}
};
