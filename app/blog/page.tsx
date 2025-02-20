import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Author, BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "queryFi - Blog",
};

export default async function BlogIndexPage() {
  const blogs = (await getAllBlogs()).sort(
    (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
  );

  return (
    <div className='w-full mx-auto flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2'>
      <div className='flex flex-col gap-2 mb-7'>
        <h1 className='text-3xl font-extrabold'>
          The latest blogs of this product
        </h1>
        <p className='text-muted-foreground'>
          All the latest blogs and news, straight from the team.
        </p>
      </div>
      <div className='grid grid-cols-1 gap-4 mb-5 md:grid-cols-3 sm:grid-cols-2 sm:gap-8'>
        {blogs.map((blog: any) => (
          <BlogCard {...blog} slug={blog.slug} key={blog.slug} />
        ))}
      </div>
    </div>
  );
}

function BlogCard({
  date,
  title,
  description,
  slug,
  cover,
  authors,
}: BlogMdxFrontmatter & { slug: string }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className='flex flex-col gap-2 items-start border rounded-md py-5 px-3 min-h-[400px] hover:border-zinc-600 ease-in-out duration-300'
    >
      <h3 className='-mt-1 font-semibold text-md pr-7'>{title}</h3>
      <div className='w-full'>
        <Image
          src={cover}
          alt={title}
          width={400}
          height={150}
          quality={80}
          className='w-full rounded-md object-cover h-[180px] border'
        />
      </div>
      <p className='text-sm text-muted-foreground'>{description}</p>
      <div className='flex items-center justify-between w-full mt-auto'>
        <p className='text-[13px] text-muted-foreground'>
          Published on {formatDate2(date)}
        </p>
        <AvatarGroup users={authors} />
      </div>
    </Link>
  );
}

function AvatarGroup({ users, max = 4 }: { users: Author[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className='flex items-center'>
      {displayUsers.map((user, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Avatar
              className={`inline-block w-9 h-9 border ${
                index !== 0 ? "-ml-3" : ""
              } `}
            >
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{user.username}</TooltipContent>
        </Tooltip>
      ))}
      {remainingUsers > 0 && (
        <Avatar className='inline-block -ml-3 transition-transform border-background hover:translate-y-1'>
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
