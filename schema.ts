export interface PortfolioDto {
  about: {
    desc: Text[];
  },
  headline: {
    desc: Text[]
  },
  projects: {
    name: string,
    desc: Text[],
    link: string
    startDate: string,
    endDate: string
  }[],
  contacts: {
    name: string,
    desc: Text[],
    link: string
  }[],
  articles: {
    name: string,
    desc: Text[],
    link: string,
  }[],
  publications: {
    name: string,
    desc: Text[],
    link: string,
  }[],
  press: {
    name: string,
    desc: Text[],
    link: string
  }[],
  research: {
    name: string,
    desc: Text[],
    link: string,
    startDate: string,
    endDate: string
  }[],
  positions: {
    name: string,
    desc: Text[],
    link: string,
    startDate: string,
    endDate: string,
  }[],
  awards: {
    name: string,
    dateReceived: string,
  }[],
  certifications: {
    name: string,
    link: string,
    dateReceived: string,
  }[],
  education: {
    name: string,
    desc: Text[];
    link: string;
    startDate: string;
    endDate: string;
  }[],
  skills: {
    name: string
  }[]
}

export interface Page {
  id: any,
  name?: string,
  desc?: Text[],
  type?: string,
  link?: string,
  published?: boolean,
  startDate?: string,
  endDate?: string
}


// RETIRE THIS
export interface Properties {
    // Required properties
    properties: {
      Id: any,
      Name: {
        title: {
          text?: {
            content: string;
          }
        }
      },
      Description: {
        rich_text?: {
          text?: {
            content: string;
          }
        }
      }
      Link: {
        url: string;
      },
      Type: {
        select?: {
          name: string;
        }
      },
      Publish: {
        checkbox: boolean
      },
      StartDate: {
        date: {
          start: string;
        }
      },
      EndDate: {
        date: {
          start: string;
        }
      },
    }

}

export interface Text {
  text:string,
  link: { url:string} | null,
  bold: boolean,
  italic: boolean,
  strikethrough: boolean,
  underline: boolean,
  code: boolean,
  color: "default" | "red"
}
  
export type Category =
    | "about"
    | "headline"
    | "project"
    | "contact"
    | "article"
    | "publication"
    | "press"
    | "research"
    | "position"
    | "award"
    | "certification"
    | "education"
    | "skill"