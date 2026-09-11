import JSZip from 'jszip';
import { ProjectIdea } from '../types';

export async function downloadProjectAsZip(project: ProjectIdea) {
  const zip = new JSZip();

  // Root files
  zip.file('README.md', `# ${project.title}
> ${project.tagline}

## Category: ${project.category} | Level: ${project.complexity}

### Why this project is crazy:
${project.whyCrazy}

### Viral Factor:
${project.viralFactor}

### Next.js 15 Features Demonstrated:
${project.nextjsFeatures.map((f) => `- **${f.tag}**: ${f.title} - ${f.description}`).join('\n')}

### Quick Start:
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Run Next.js 15 development server
npm run dev

# 3. Open browser at http://localhost:3000
\`\`\`
`);

  // Add all project code files
  project.files.forEach((file) => {
    zip.file(file.path, file.code);
  });

  // Add default tsconfig.json if not present
  if (!project.files.some((f) => f.path === 'tsconfig.json')) {
    zip.file(
      'tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            target: 'es5',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            plugins: [{ name: 'next' }],
            paths: { '@/*': ['./*'] }
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules']
        },
        null,
        2
      )
    );
  }

  // Generate zip file and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.id}-nextjs15-demo.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
