import { Heart, MessageCircle, Pin, Send, Star, ThumbsUp } from 'lucide-react'

export function FeedPage() {
  return (
    //    container
    <div
      className="
    max-w-[1280px]
    mx-auto
    px-8
    relative
    z-[2]
    w-full
  "
    >
      {/* header */}
      <div className="pt-[3.5rem] pb-8 flex items-end justify-between gap-8 flex-wrap">
        {/* left  */}
        <div>
          <h1
            className="
  font-display
  font-extrabold
  text-[clamp(2rem,4vw,3.25rem)]
  tracking-[-0.04em]
  leading-[1]
"
          >
            Feed
          </h1>
        </div>
        {/* right */}
        <div
          className="
  inline-flex
  items-center
  gap-2
  bg-[hsl(var(--card))]
  border
  border-[hsl(var(--border))]
  rounded-full
  px-[0.95rem]
  py-[0.45rem]
  font-mono
  text-[0.7rem]
  uppercase
  tracking-[0.12em]
  text-[hsl(var(--foreground-muted))]
"
        >
          Compteur publication
        </div>
      </div>

      {/* feed layout */}
      <div
        className="
  flex
  flex-col
  gap-6
  pb-20
  max-w-[640px]
  mx-auto
"
      >
        {/* feed colonne */}
        <div
          className="
  flex
  flex-col
  gap-4
  min-w-0
"
        >
          {/* admin composer  */}
          <div
            className="
  bg-[hsl(var(--card))]
  border
  border-[hsl(var(--border))]
  rounded-[var(--radius)]
  p-5
  relative
  overflow-hidden
"
          >
            {/* composer head */}
            <div
              className="
  flex
  items-center
  gap-3
  mb-[0.875rem]
"
            >
              {/* avatar  */}
              <div
                className="
  w-[38px]
  h-[38px]
  rounded-full
  bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))]
  border-[1.5px]
  border-[hsl(var(--primary)/0.4)]
  flex
  items-center
  justify-center
  font-display
  font-extrabold
  text-[0.78rem]
  text-[hsl(var(--primary))]
  shrink-0
"
              >
                AD
              </div>
              {/* composeur méta  */}
              <div className="flex-1">
                {/* composeur name  */}
                <div
                  className="
  flex
  items-center
  gap-2
  font-semibold
  text-sm
  text-[hsl(var(--foreground))]
"
                >
                  Admin
                  <span
                    className="
  inline-flex
  items-center
  gap-1
  bg-[hsl(var(--gold)/0.12)]
  border
  border-[hsl(var(--gold)/0.3)]
  text-[hsl(var(--gold))]
  font-mono
  text-[0.55rem]
  uppercase
  tracking-[0.12em]
  py-[0.12rem]
  px-[0.45rem]
  rounded-full
  font-semibold
"
                  >
                    <Star className="w-[9px] h-[9px]" />
                    Admin
                  </span>
                </div>
                {/* composeur-sublabel */}
                <div
                  className="
  font-mono
  text-[0.62rem]
  text-[hsl(var(--foreground-muted))]
  uppercase
  tracking-[0.1em]
  mt-[0.1rem]
"
                >
                  Nouvelle publication
                </div>
              </div>
            </div>
            {/* composeur textarea */}
            <textarea
              placeholder="Adressez un message à la commu DWC"
              className="
              resize-none
  w-full
  bg-[hsl(var(--background-dark))]
  border
  border-[hsl(var(--border))]
  rounded-[var(--radius)]
  py-3
  px-[0.875rem]
  font-sans
  text-sm
  text-[hsl(var(--foreground))]
  min-h-[80px]
  outline-none
  transition-colors
  leading-[1.5]
"
            ></textarea>
            {/* composeur action  */}
            <div
              className="
  flex
  items-center
  justify-between
  mt-[0.875rem]
  gap-2
  flex-wrap
"
            >
              {/* composeur tools */}
              <div
                className="
  flex
  gap-[0.3rem]
"
              >
                {/* bouton add img */}
                <button
                  className="
  w-[32px]
  h-[32px]
  rounded-[calc(var(--radius)-2px)]
  border
  border-[hsl(var(--border))]
  bg-transparent
  cursor-pointer
  flex
  items-center
  justify-center
  text-[hsl(var(--foreground-muted))]
  transition-colors
"
                >
                  IMG
                </button>
                {/* (d'autres btn? add fichier?) */}
              </div>
              {/* composer submit  */}
              <button
                className="
 inline-flex
  items-center
  gap-[0.4rem]
  bg-[hsl(var(--primary))]
  text-[hsl(var(--primary-foreground))]
  font-sans
  text-[0.8125rem]
  font-semibold
  py-[0.55rem]
  px-[1.1rem]
  rounded-[calc(var(--radius)-2px)]
  cursor-pointer
  transition-opacity
  transition-transform

  disabled:opacity-45
  disabled:cursor-not-allowed
  disabled:transform-none
"
              >
                <Send className="w-[18px] h-[18px]" />
                Publier
              </button>
            </div>
          </div>

          {/* postListe  */}
          <div className="box-border m-0 p-0">
            {/* post pinned  */}
            <div
              className="
              mb-[3vh]
  bg-[hsl(var(--card))]
  border
  border-[hsl(var(--border))]
  rounded-[var(--radius)]
  overflow-hidden
  transition-colors

  border-[hsl(var(--gold)/0.35)]
"
            >
              {/* pinned banner  */}
              <div
                className="
  bg-[hsl(var(--gold)/0.08)]
  border-b
  border-b-[hsl(var(--gold)/0.2)]
  py-2
  px-5
  flex
  items-center
  gap-2
  font-mono
  text-[0.6rem]
  uppercase
  tracking-[0.14em]
  text-[hsl(var(--gold))]
"
              >
                <Pin className="w-[12px] h-[12px]" />
                Epinglé par l'admin
              </div>
              {/* post-header  */}
              <div
                className="
  flex
  items-center
  gap-3
  pt-[1.1rem]
  px-5
  pb-2
"
              >
                {/* avatar */}
                <div
                  className="
  w-[42px]
  h-[42px]
  rounded-full
  bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))]
  border-[1.5px]
  border-[hsl(var(--primary)/0.4)]
  flex
  items-center
  justify-center
  font-display
  font-extrabold
  text-[0.82rem]
  text-[hsl(var(--primary))]
  shrink-0
"
                >
                  AD
                </div>
                {/* post meta  */}
                <div
                  className="
  flex-1
  min-w-0
"
                >
                  {/* post author  */}
                  <div
                    className="
  flex
  items-center
  gap-[0.45rem]
  font-semibold
  text-[0.9rem]
  text-[hsl(var(--foreground))]
"
                  >
                    auteur poste
                    <span
                      className="
  inline-flex
  items-center
  gap-1
  bg-[hsl(var(--gold)/0.12)]
  border
  border-[hsl(var(--gold)/0.3)]
  text-[hsl(var(--gold))]
  font-mono
  text-[0.55rem]
  uppercase
  tracking-[0.12em]
  py-[0.12rem]
  px-[0.45rem]
  rounded-full
  font-semibold
"
                    >
                      <Star className="w-[9px] h-[9px]" />
                      Admin
                    </span>
                  </div>
                  {/* post info  */}
                  <div
                    className="
  font-mono
  text-[0.62rem]
  text-[hsl(var(--foreground-muted))]
  uppercase
  tracking-[0.1em]
  mt-[0.15rem]
  flex
  items-center
  gap-[0.4rem]
"
                  >
                    <span>Organisation</span>
                    <span
                      className="
  w-[3px]
  h-[3px]
  rounded-full
  bg-[hsl(var(--foreground-muted))]
"
                    ></span>
                    <span>Il y a 3 jours</span>
                    <span
                      className="
  w-[3px]
  h-[3px]
  rounded-full
  bg-[hsl(var(--foreground-muted))]
"
                    ></span>
                    <span>Annonce</span>
                  </div>
                </div>
              </div>
              {/* poste body  */}
              <div
                className="
  pt-1
  px-5
  pb-4
  text-[0.9rem]
  text-[hsl(var(--foreground-secondary))]
  leading-[1.6]
  whitespace-pre-wrap
  break-words
"
              >
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              {/* reaction-strip  */}
              <div
                className="
  flex
  items-center
  justify-between
  flex-wrap
  gap-2
  py-[0.6rem]
  px-5
  border-t
  border-b
  border-[hsl(var(--border)/0.4)]
  text-[0.78rem]
  text-[hsl(var(--foreground-muted))]
"
              >
                {/* left */}
                <div
                  className="
  flex
  items-center
  gap-[0.4rem]
"
                >
                  {/* icones  */}
                  <div className="flex items-center gap-[0.4rem]">
                    <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                      <ThumbsUp className="w-[16px] h-[16px]" />
                    </span>

                    <span> compteur like</span>
                  </div>
                </div>
                {/* right  */}
                <div className="flex items-center gap-[0.4rem]">
                  <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                    <MessageCircle className="w-[16px] h-[16px]" />
                  </span>
                  <span> compteur commentaire</span>
                </div>
              </div>
              {/* post actions  */}
              <div
                className="
  flex
  gap-1
  py-[0.4rem]
  px-[0.6rem]
"
              >
                {/* action btn like  */}
                <button
                  className="
  flex-1
  flex
  items-center
  justify-center
  gap-[0.45rem]
  bg-transparent
  border-none
  py-[0.6rem]
  px-[0.5rem]
  rounded-[calc(var(--radius)-4px)]
  font-sans
  text-[0.8rem]
  font-medium
  text-[hsl(var(--foreground-muted))]
  cursor-pointer
  transition-colors
  transition-transform
"
                >
                  <ThumbsUp className="w-[16px] h-[16px]" />
                  Like
                </button>
                {/* action btn comments  */}
                <button
                  className="
  flex-1
  flex
  items-center
  justify-center
  gap-[0.45rem]
  bg-transparent
  border-none
  py-[0.6rem]
  px-[0.5rem]
  rounded-[calc(var(--radius)-4px)]
  font-sans
  text-[0.8rem]
  font-medium
  text-[hsl(var(--foreground-muted))]
  cursor-pointer
  transition-colors
  transition-transform
"
                >
                  <MessageCircle className="w-[16px] h-[16px]" />
                  Comment
                </button>
              </div>
              {/* comment section  */}
              <div
                className="
  hidden
  border-t
  border-[hsl(var(--border)/0.4)]
  pt-[0.875rem]
  px-5
  pb-4
"
              >
                {/* commentaire  */}
                <div
                  className="
  flex
  gap-[0.625rem]
  py-2
"
                >
                  {/* avatar */}
                  <div
                    className="
  w-[30px]
  h-[30px]
  rounded-full
  flex
  items-center
  justify-center
  font-display
  font-extrabold
  text-[0.65rem]
  shrink-0
"
                  >
                    VB
                  </div>
                  {/* comment bubble */}
                  <div
                    className="
  flex-1
  min-w-0
"
                  >
                    {/* comment bubble inner */}
                    <div
                      className="
  bg-[hsl(var(--background-dark))]
  border
  border-[hsl(var(--border)/0.5))]
  rounded-[14px]
  py-2
  px-3
"
                    >
                      {/* nom commentateur */}
                      <div
                        className="
  text-[0.76rem]
  font-semibold
  text-[hsl(var(--foreground))]
  mb-[0.1rem]
"
                      >
                        David Becane
                      </div>
                      {/* comment content */}
                      <div
                        className="
  text-[0.82rem]
  text-[hsl(var(--foreground-secondary))]
  leading-[1.4]
"
                      >
                        chaud bouillant
                      </div>
                    </div>
                    {/* comment action */}
                    <div
                      className="
  mt-1
  px-3
  flex
  items-center
  gap-3
  font-mono
  text-[0.6rem]
  uppercase
  tracking-[0.08em]
  text-[hsl(var(--foreground-muted))]
"
                    >
                      {/* btn like */}
                      <button
                        className="
  bg-none
  border-none
  cursor-pointer
  text-[hsl(var(--foreground-muted))]
  p-0
  font-inherit
  uppercase:inherit
  tracking-inherit
  transition-colors
"
                      >
                        <Heart className="w-[14px] h-[14px]" />
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* second post non pinned */}
            <div
              className="
              mb-[3vh]
  bg-[hsl(var(--card))]
  border
  border-[hsl(var(--border))]
  rounded-[var(--radius)]
  overflow-hidden
  transition-colors
"
            >
              {/* post-header  */}
              <div
                className="
  flex
  items-center
  gap-3
  pt-[1.1rem]
  px-5
  pb-2
"
              >
                {/* avatar */}
                <div
                  className="
  w-[42px]
  h-[42px]
  rounded-full
  bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))]
  border-[1.5px]
  border-[hsl(var(--primary)/0.4)]
  flex
  items-center
  justify-center
  font-display
  font-extrabold
  text-[0.82rem]
  text-[hsl(var(--primary))]
  shrink-0
"
                >
                  VB
                </div>
                {/* post meta  */}
                <div
                  className="
  flex-1
  min-w-0
"
                >
                  {/* post author  */}
                  <div
                    className="
  flex
  items-center
  gap-[0.45rem]
  font-semibold
  text-[0.9rem]
  text-[hsl(var(--foreground))]
"
                  >
                    Virgile
                  </div>
                  {/* post info  */}
                  <div
                    className="
  font-mono
  text-[0.62rem]
  text-[hsl(var(--foreground-muted))]
  uppercase
  tracking-[0.1em]
  mt-[0.15rem]
  flex
  items-center
  gap-[0.4rem]
"
                  >
                    <span>Communauté</span>
                    <span
                      className="
  w-[3px]
  h-[3px]
  rounded-full
  bg-[hsl(var(--foreground-muted))]
"
                    ></span>
                    <span>Il y a 1 jour</span>
                  </div>
                </div>
              </div>
              {/* poste body  */}
              <div
                className="
  pt-1
  px-5
  pb-4
  text-[0.9rem]
  text-[hsl(var(--foreground-secondary))]
  leading-[1.6]
  whitespace-pre-wrap
  break-words
"
              >
                <p>
                  Voici un post classique non épinglé. Il suit la même structure
                  générale que le post principal, mais sans la bannière
                  d&apos;épingle ni le style gold. Tu peux le dupliquer pour
                  remplir ton feed avec des posts standards.
                </p>
              </div>
              {/* reaction-strip  */}
              <div
                className="
  flex
  items-center
  justify-between
  flex-wrap
  gap-2
  py-[0.6rem]
  px-5
  border-t
  border-b
  border-[hsl(var(--border)/0.4)]
  text-[0.78rem]
  text-[hsl(var(--foreground-muted))]
"
              >
                {/* left */}
                <div
                  className="
  flex
  items-center
  gap-[0.4rem]
"
                >
                  {/* icones  */}
                  <div className="flex items-center gap-[0.4rem]">
                    <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                      <ThumbsUp className="w-[16px] h-[16px]" />
                    </span>

                    <span> compteur like</span>
                  </div>
                </div>
                {/* right  */}
                <div className="flex items-center gap-[0.4rem]">
                  <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                    <MessageCircle className="w-[16px] h-[16px]" />
                  </span>
                  <span> compteur commentaire</span>
                </div>
              </div>
              {/* post actions  */}
              <div
                className="
  flex
  gap-1
  py-[0.4rem]
  px-[0.6rem]
"
              >
                {/* action btn like  */}
                <button
                  className="
  flex-1
  flex
  items-center
  justify-center
  gap-[0.45rem]
  bg-transparent
  border-none
  py-[0.6rem]
  px-[0.5rem]
  rounded-[calc(var(--radius)-4px)]
  font-sans
  text-[0.8rem]
  font-medium
  text-[hsl(var(--foreground-muted))]
  cursor-pointer
  transition-colors
  transition-transform
"
                >
                  <ThumbsUp className="w-[16px] h-[16px]" />
                  Like
                </button>
                {/* action btn comments  */}
                <button
                  className="
  flex-1
  flex
  items-center
  justify-center
  gap-[0.45rem]
  bg-transparent
  border-none
  py-[0.6rem]
  px-[0.5rem]
  rounded-[calc(var(--radius)-4px)]
  font-sans
  text-[0.8rem]
  font-medium
  text-[hsl(var(--foreground-muted))]
  cursor-pointer
  transition-colors
  transition-transform
"
                >
                  <MessageCircle className="w-[16px] h-[16px]" />
                  Comment
                </button>
              </div>
              {/* comment section  */}
              <div
                className="
  hidden
  border-t
  border-[hsl(var(--border)/0.4)]
  pt-[0.875rem]
  px-5
  pb-4
"
              >
                {/* commentaire  */}
                <div
                  className="
  flex
  gap-[0.625rem]
  py-2
"
                >
                  {/* avatar */}
                  <div
                    className="
  w-[30px]
  h-[30px]
  rounded-full
  flex
  items-center
  justify-center
  font-display
  font-extrabold
  text-[0.65rem]
  shrink-0
"
                  >
                    VB
                  </div>
                  {/* comment bubble */}
                  <div
                    className="
  flex-1
  min-w-0
"
                  >
                    {/* comment bubble inner */}
                    <div
                      className="
  bg-[hsl(var(--background-dark))]
  border
  border-[hsl(var(--border)/0.5))]
  rounded-[14px]
  py-2
  px-3
"
                    >
                      {/* nom commentateur */}
                      <div
                        className="
  text-[0.76rem]
  font-semibold
  text-[hsl(var(--foreground))]
  mb-[0.1rem]
"
                      >
                        Membre
                      </div>
                      {/* comment content */}
                      <div
                        className="
  text-[0.82rem]
  text-[hsl(var(--foreground-secondary))]
  leading-[1.4]
"
                      >
                        Super post !
                      </div>
                    </div>
                    {/* comment action */}
                    <div
                      className="
  mt-1
  px-3
  flex
  items-center
  gap-3
  font-mono
  text-[0.6rem]
  uppercase
  tracking-[0.08em]
  text-[hsl(var(--foreground-muted))]
"
                    >
                      {/* btn like */}
                      <button
                        className="
  bg-none
  border-none
  cursor-pointer
  text-[hsl(var(--foreground-muted))]
  p-0
  font-inherit
  uppercase:inherit
  tracking-inherit
  transition-colors
"
                      >
                        <Heart className="w-[14px] h-[14px]" />
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end second post */}
          </div>
        </div>
      </div>
    </div>
  )
}
