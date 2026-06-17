import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

const TEAM_MEMBERS = [
  {
    category: 'Founders',
    members: [
      {
        name: 'Rajesh Kumar',
        role: 'Founder & CEO',
        bio: '20+ years in construction and real estate development across Karnataka',
        email: 'founder@demo.test',
        avatar: '👨‍💼',
        color: 'from-amber-500 to-orange-600'
      },
      {
        name: 'Priya Sharma',
        role: 'Co-Founder & COO',
        bio: 'Operations expert specializing in project delivery and client relations',
        email: 'founder2@demo.test',
        avatar: '👩‍💼',
        color: 'from-amber-500 to-orange-600'
      }
    ]
  },
  {
    category: 'Leadership',
    members: [
      {
        name: 'Arun Patel',
        role: 'Chief Architect',
        bio: 'Award-winning architect with 100+ residential and commercial projects',
        email: 'architect@demo.test',
        avatar: '👨‍🎨',
        color: 'from-blue-500 to-cyan-600'
      },
      {
        name: 'Kavya Reddy',
        role: 'Head of Engineering',
        bio: 'Structural engineering expert ensuring quality and safety standards',
        email: 'engineer@demo.test',
        avatar: '👩‍🔧',
        color: 'from-green-500 to-emerald-600'
      },
      {
        name: 'Vikram Singh',
        role: 'Project Director',
        bio: 'Oversees all active projects with focus on timelines and quality',
        email: 'projectadmin@demo.test',
        avatar: '👨‍💼',
        color: 'from-purple-500 to-indigo-600'
      }
    ]
  },
  {
    category: 'Administrators',
    members: [
      {
        name: 'Anita Desai',
        role: 'System Administrator',
        bio: 'Manages portal access, documentation, and client onboarding',
        email: 'admin@demo.test',
        avatar: '👩‍💻',
        color: 'from-pink-500 to-rose-600'
      },
      {
        name: 'Suresh Nair',
        role: 'Finance Manager',
        bio: 'Handles billing, payments, and financial transparency for all projects',
        email: 'admin2@demo.test',
        avatar: '👨‍💼',
        color: 'from-pink-500 to-rose-600'
      }
    ]
  },
  {
    category: 'Technical Team',
    members: [
      {
        name: 'Deepak Menon',
        role: 'Senior Architect',
        bio: 'Specializes in modern residential designs and sustainable architecture',
        email: 'architect2@demo.test',
        avatar: '👨‍🎨',
        color: 'from-blue-500 to-cyan-600'
      },
      {
        name: 'Meera Iyer',
        role: 'Civil Engineer',
        bio: 'Structural design and site supervision for commercial projects',
        email: 'engineer2@demo.test',
        avatar: '👩‍🔧',
        color: 'from-green-500 to-emerald-600'
      },
      {
        name: 'Ramesh Gowda',
        role: 'Interior Designer',
        bio: 'Creates functional and aesthetic interior spaces for homes and offices',
        email: 'designer@demo.test',
        avatar: '🎨',
        color: 'from-violet-500 to-purple-600'
      }
    ]
  }
];

export default function TeamPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary via-secondary to-brand-gold/10 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm font-semibold mb-4">
              Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Meet the People Building Your Dreams
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Our experienced team of architects, engineers, and project managers
              brings decades of expertise to every project we deliver.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-gray-50 py-16">
        <div className="container max-w-7xl mx-auto">
          {TEAM_MEMBERS.map((section, idx) => (
            <div key={idx} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-brand-gold to-brand-amber rounded-full"></div>
                <h2 className="text-3xl font-display font-bold text-secondary">
                  {section.category}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.members.map((member, memberIdx) => (
                  <div
                    key={memberIdx}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className={`h-32 bg-gradient-to-br ${member.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="relative px-6 pb-6 -mt-12">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform duration-300">
                          {member.avatar}
                        </div>
                        <div className="flex-1 pt-2">
                          <h3 className="text-xl font-display font-bold text-secondary mb-1">
                            {member.name}
                          </h3>
                          <p className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-4">
                        {member.bio}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="inline-block">📧</span>
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-secondary to-brand-gold/20 text-white py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Our team is ready to bring your construction vision to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Get in Touch →
            </Link>
            <Link href="/#projects" className="btn btn-ghost border-white/20 hover:bg-white/10">
              View Our Projects
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
