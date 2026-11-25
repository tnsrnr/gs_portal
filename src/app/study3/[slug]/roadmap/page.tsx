import { redirect } from 'next/navigation';

export default function Study3RoadmapRedirect({ params }: { params: { slug: string } }) {
  redirect(`/study3/${params.slug}`);
}
