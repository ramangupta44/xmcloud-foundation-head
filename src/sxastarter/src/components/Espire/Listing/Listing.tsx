import { apolloClient } from 'lib/graphql/graphql-apollo-client';
import { Listing_Query } from 'lib/graphql/query/listing';
import { useRouter } from 'next/router';
import { GlobalUniversity_Course_Listing_Query } from 'lib/graphql/query/globaluniversity-course-listing';
import { ReactNode, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  ActualData,
  ListingProps,
  list,
  result,
} from 'lib/component-props/EspireTemplateProps/Listing/ListingProps';
import { Field, ImageField, useSitecoreContext, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { GlobalUniversity_Blog_Listing_Query } from 'lib/graphql/query/globaluniversity-blog-listing';

type CourseListingData = {
  CourseListingData: {
    results: CourseListingResult[];
    total: number;
  };
};
type BlogListingData = {
  BlogListingData: {
    results: BlogListingResult[];
    total: number;
  };
};

type CourseListingResult = {
  image: ImageProps;
  thumbnailImage: ImageProps;
  title: Field<string>;
  applyNowURL: LinkField;
  content: Field<string>;
  courseType: TagTreeListProps;
  location: TagTreeListProps;
  studyMode: TagTreeListProps;
  url: {
    path: string;
  };
};
type BlogListingResult = {
  thumbnailImage: ImageProps;
  title: Field<string>;
  content: Field<string>;
  url: {
    path: string;
  };
};

type LinkField = {
  jsonValue: {
    value: {
      [key: string]: string;
    };
  };
};

//Listing
type ImageProps = ImageField & {
  jsonValue: {
    value: {
      src: string;
      alt: string;
    };
  };
};

type TagTreeListProps = {
  targetItems: TagTreeListData[];
};

type TagTreeListData = {
  name: string;
};

type ItemSearchPredicateInput = {
  name: string;
  value: string;
  operator: string;
};

type ItemSearchOrderByInput = {
  name: string;
  direction: string;
};

const IterateData = (input: TagTreeListProps): ReactNode => {
  return input?.targetItems?.map((item, index) => {
    return <React.Fragment key={index}> {item?.name}</React.Fragment>;
  });
};

const Listing = (props: ListingProps): JSX.Element => {
  const [data, setData] = useState<ListingProps>();
  const [loadMore, SetLoadMore] = useState('');
  const [result, Setresult] = useState<ListingProps>();
  const [hasnext, SetHasNext] = useState<ListingProps>();
  const [items, setItems] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const initialState: SetStateAction<never[]> = [];

  const { sitecoreContext } = useSitecoreContext();
  const scope = props?.params?.Scope;
  const language = sitecoreContext?.language;
  const count = parseInt(props?.params?.['Display Count']);

  const GetList = async (): Promise<unknown> => {
    const { data } = await apolloClient.query({
      query: Listing_Query,
      variables: {
        contextItem: scope,
        language: language,
        first: count,
        after: loadMore,
      },
    });
    return data;
  };
  const refresh = () => {
    setItems(initialState);
  };

  useEffect(() => {
    async function startFetching() {
      setData(undefined);
      const result = await GetList();
      if (!ignore) {
        setData(
          (result as ListingProps)?.ListingData?.children?.results as unknown as ListingProps
        );
        SetLoadMore((result as ListingProps)?.ListingData?.children?.pageInfo?.endCursor);
        SetHasNext(
          (result as ListingProps)?.ListingData?.children?.pageInfo
            ?.hasNext as unknown as ListingProps
        );
        Setresult(result as ListingProps);
        setFinalData(data as unknown as []);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    SetHasNext(undefined);
    function isHasNext() {
      SetHasNext(
        (result as ListingProps)?.ListingData?.children?.pageInfo
          ?.hasNext as unknown as ListingProps
      );
      setFinalData(data as unknown as []);
    }

    isHasNext();
  }, [result, data]);
  const LoadMore = async () => {
    let finalData = [data]?.flat();
    const result = await GetList();

    finalData = [
      ...[finalData],
      ...[(result as ListingProps)?.ListingData?.children?.results as unknown as ListingProps],
    ]?.flat();
    setData(finalData as unknown as ListingProps);
    if (hasnext) {
      SetLoadMore((result as ListingProps)?.ListingData?.children?.pageInfo?.endCursor);
    }
    Setresult(result as ListingProps);
  };

  return (
    <div className={`${props?.params?.styles} default-listing`}>
      {props?.params?.['Show More'] ? (
        <div className="listing">
          {finalData?.map((item: list, index) => {
            let items = [];
            items = item?.fields as unknown as [];
            return (
              <div key={index} className="list">
                {items?.map((childData: result, index) => {
                  return (
                    (childData?.name as unknown as string) == 'Title' && (
                      <h1 key={index}>
                        {childData?.name as unknown as string} : {''}
                        {childData?.value as unknown as string}
                      </h1>
                    )
                  );
                })}
              </div>
            );
          })}
          {data ? (
            <button onClick={() => LoadMore()} className="button">
              Load More
            </button>
          ) : (
            ''
          )}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={items?.length}
          next={LoadMore}
          hasMore={true}
          loader={<span className="hidden"></span>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          refreshFunction={refresh}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}> Pull down to refresh</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>Release to refresh</h3>}
        >
          <div className="listing">
            {finalData?.map((item: list, index) => {
              let items = [];
              items = item?.fields as unknown as [];
              return (
                <div key={index} className="list">
                  {items?.map((childData: result, index) => {
                    return (
                      (childData?.name as unknown as string) == 'Title' && (
                        <div key={index}>
                          {childData?.name as unknown as string} :{''}
                          {childData?.value as unknown as string}
                        </div>
                      )
                    );
                  })}
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export const ListCard = (props: ListingProps): JSX.Element => {
  const [data, setData] = useState<ListingProps>();
  const [loadMore, SetLoadMore] = useState('');
  const [result, Setresult] = useState<ListingProps>();
  const [hasnext, SetHasNext] = useState<ListingProps>();
  const [items, setItems] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const initialState: SetStateAction<never[]> = [];

  const { sitecoreContext } = useSitecoreContext();
  const scope = props?.params?.Scope;
  const language = sitecoreContext?.language;
  const count = parseInt(props?.params?.['Display Count']);

  const GetList = async (): Promise<unknown> => {
    const { data } = await apolloClient.query({
      query: Listing_Query,
      variables: {
        contextItem: scope,
        language: language,
        first: count,
        after: loadMore,
      },
    });
    return data;
  };
  const refresh = () => {
    setItems(initialState);
  };

  useEffect(() => {
    async function startFetching() {
      setData(undefined);
      const result = await GetList();
      if (!ignore) {
        setData(
          (result as ListingProps)?.ListingData?.children?.results as unknown as ListingProps
        );
        SetLoadMore((result as ListingProps)?.ListingData?.children?.pageInfo?.endCursor);
        SetHasNext(
          (result as ListingProps)?.ListingData?.children?.pageInfo
            ?.hasNext as unknown as ListingProps
        );
        Setresult(result as ListingProps);
        setFinalData(data as unknown as []);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    SetHasNext(undefined);
    function isHasNext() {
      SetHasNext(
        (result as ListingProps)?.ListingData?.children?.pageInfo
          ?.hasNext as unknown as ListingProps
      );
      setFinalData(data as unknown as []);
    }

    isHasNext();
  }, [result, data]);

  const LoadMore = async () => {
    let finalData = [data]?.flat();
    const result = await GetList();

    finalData = [
      ...[finalData],
      ...[(result as ListingProps)?.ListingData?.children?.results as unknown as ListingProps],
    ]?.flat();
    setData(finalData as unknown as ListingProps);
    if (hasnext) {
      SetLoadMore((result as ListingProps)?.ListingData?.children?.pageInfo?.endCursor);
    }
    Setresult(result as ListingProps);
  };

  let newData: unknown[] = [];

  finalData?.forEach((item: list) => {
    let items = [];

    items = item?.fields as unknown as [];
    const filteredData = items?.filter((item: result) => {
      return item.name === 'Title' || item?.name === 'Content' || item?.name === 'Image';
    });
    newData = [...newData, ...[filteredData]];
    return newData;
  });

  const actualData: unknown[] = [];
  let newObj = {};
  newData.forEach((newData, index) => {
    const urlData = (finalData[index] as list)?.url;
    const emptyObject = Object.assign({ urlData });
    (newData as [])?.forEach((element: { name: string; jsonValue: unknown }) => {
      newObj = Object.assign(emptyObject, {
        [element.name]: element.jsonValue,
      });
    });
    actualData?.push(newObj);
  });

  return (
    <div className={`${props?.params?.styles} listing card-listing`}>
      {props?.params?.['Show More'] ? (
        <>
          <div className="container">
            <div className="blogs">
              <div className="py-0">
                <div className="row row-cols-1 row-cols-md-3 gx-5 gy-5">
                  {actualData?.map((item: ActualData, index: number) => {
                    return (
                      <div className="col mb-3 mb-lg-0" key={index}>
                        <div className="img-title">
                          <img src={item?.Image?.value?.src} alt={item?.Image?.value?.alt} />
                          <div className="rounded-bottom-4 blog-info">
                            <div className="blog-title">{item?.Title?.value}</div>
                            <p>{item?.Content?.Value}</p>
                            <a href={item?.urlData?.path} className="secondary-btn">
                              Read more
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {data && (
              <div className="mt-5 mx-auto my-0">
                <button onClick={() => LoadMore()} className="button">
                  Load More
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <InfiniteScroll
          dataLength={items?.length}
          next={LoadMore}
          hasMore={true}
          loader={<span className="hidden"></span>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          refreshFunction={refresh}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}> Pull down to refresh</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>Release to refresh</h3>}
        >
          <div className="listing">
            {finalData?.map((item: list, index) => {
              let items = [];
              items = item?.fields as unknown as [];
              return (
                <div key={index} className="list">
                  {items?.map((childData: result, index) => {
                    return (
                      (childData?.name as unknown as string) == 'Title' && (
                        <div key={index}>
                          {childData?.name as unknown as string} :{''}
                          {childData?.value as unknown as string}
                        </div>
                      )
                    );
                  })}
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export const CourseListing = (props: ListingProps): JSX.Element => {
  const router = useRouter();
  const [courseListData, setCourseListData] = useState<CourseListingData>();
  const [sortBy, setSortBy] = useState('relevance');
  const path = props?.params?.Scope;
  const template = props?.params?.Template;
  const { keyword, category, type } = router?.query;

  const defaultCourseTypeObject = {
    name: 'CourseType',
    value: '*',
    operator: 'NCONTAINS',
  };
  const defaultCourseCategoryObject = {
    name: 'CourseCategory',
    value: '*',
    operator: 'NCONTAINS',
  };
  const defaultKeywordObject = {
    name: 'Title',
    value: '*',
    operator: 'CONTAINS',
  };

  const defaultOrderBy = {
    name: 'Title',
    direction: 'DESC',
  };
  const GetCourseData = async (
    path: string,
    template: string,
    keyword: ItemSearchPredicateInput = defaultKeywordObject,
    courseType: ItemSearchPredicateInput = defaultCourseTypeObject,
    courseCategory: ItemSearchPredicateInput = defaultCourseCategoryObject,
    orderBy: ItemSearchOrderByInput = defaultOrderBy
  ): Promise<unknown> => {
    const { data } = await apolloClient.query({
      query: GlobalUniversity_Course_Listing_Query,
      variables: {
        path: path,
        template: template,
        keyword: keyword,
        courseType: courseType,
        courseCategory: courseCategory,
        orderBy: orderBy,
      },
    });
    return data;
  };

  function toPascalCase(text: string) {
    return text
      ?.split(' ')
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      ?.join(' ');
  }
  useEffect(() => {
    (async () => {
      if (
        path != undefined &&
        template != undefined &&
        type != undefined &&
        category != undefined &&
        keyword != undefined
      ) {
        //When all fields are empty

        if (keyword == '' && type == ' ' && category == ' ') {
          const courseData = await GetCourseData(path, template);
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type != ' ' && category != ' ') {
          //when only keyword is empty
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedCourseType,
            updatedCourseCategory
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type == ' ' && category != ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            updatedCourseCategory
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type != ' ' && category == ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            updatedCourseType
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type != ' ' && category != ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            updatedCourseType,
            updatedCourseCategory
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type == ' ' && category != ' ') {
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(path, template, updatedCourseCategory);
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type != ' ' && category == ' ') {
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(path, template, updatedCourseType);
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type == ' ' && category == ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(path, template, updatedKeywordObject);
          setCourseListData(courseData as CourseListingData);
        } else '';
      } else {
        const courseData = await GetCourseData(path, template);
        setCourseListData(courseData as CourseListingData);
      }
    })();
  }, [path, keyword, type, category]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    if (toPascalCase(e.target.value) == 'Title') {
      const updatedTitleFilter = {
        ...defaultOrderBy,
        direction: 'ASC',
      };
      (async () => {
        if (keyword == '' && type == ' ' && category == ' ') {
          const courseData = await GetCourseData(
            path,
            template,
            defaultKeywordObject,
            defaultCourseTypeObject,
            defaultCourseCategoryObject,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type != ' ' && category != ' ') {
          //when only keyword is empty
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            defaultKeywordObject,
            updatedCourseType,
            updatedCourseCategory,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type == ' ' && category != ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            defaultCourseTypeObject,
            updatedCourseCategory,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type != ' ' && category == ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            updatedCourseType,
            defaultCourseCategoryObject,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type != ' ' && category != ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            updatedCourseType,
            updatedCourseCategory,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type == ' ' && category != ' ') {
          const updatedCourseCategory = {
            ...defaultCourseCategoryObject,
            value: toPascalCase(router?.query?.category as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            defaultKeywordObject,
            defaultCourseTypeObject,
            updatedCourseCategory,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword == '' && type != ' ' && category == ' ') {
          const updatedCourseType = {
            ...defaultCourseTypeObject,
            value: toPascalCase(router?.query?.type as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            defaultKeywordObject,
            updatedCourseType,
            defaultCourseCategoryObject,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else if (keyword != '' && type == ' ' && category == ' ') {
          const updatedKeywordObject = {
            ...defaultKeywordObject,
            value: toPascalCase(router?.query?.keyword as string),
            operator: 'CONTAINS',
          };
          const courseData = await GetCourseData(
            path,
            template,
            updatedKeywordObject,
            defaultCourseTypeObject,
            defaultCourseCategoryObject,
            updatedTitleFilter
          );
          setCourseListData(courseData as CourseListingData);
        } else '';
      })();
    }
  };
  return (
    <div className="container course-listing">
      <div className="row">
        <div className="col-lg-6">
          {courseListData?.CourseListingData?.total == 0 ||
          courseListData?.CourseListingData?.total == undefined ? (
            <h5> No Results</h5>
          ) : (
            <h5>All Courses {courseListData?.CourseListingData?.total}</h5>
          )}
        </div>
        <div className="col-lg-6">
          <div className="sorting">
            <select
              className="form-select"
              aria-label="Default select example"
              name={'sortby'}
              defaultValue={sortBy}
              onChange={handleChange}
            >
              <option value="title">Sort By : Name </option>
              <option value="relevance">Sort By : Relevance </option>
            </select>
            <div className="sorting-list">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="sorting-grid-view">
              <span></span>
            </div>
          </div>
        </div>
      </div>
      {courseListData?.CourseListingData?.results?.map((list, index) => {
        return (
          <div className="row" key={index}>
            <div className="col-12 col-md-4 course-listing-image">
              <img
                src={list?.thumbnailImage?.jsonValue?.value?.src}
                alt={list?.thumbnailImage?.jsonValue?.value?.alt}
              />
            </div>
            <div className="col-12 col-md-8 course-listing-details">
              <h6> {IterateData(list?.courseType)}</h6>
              <h5>{list?.title?.value} </h5>
              <RichText field={list?.content} tag="div" />
              <hr />
              <ul className="d-flex list-group-horizontal list-unstyled">
                <li> {IterateData(list?.studyMode)}</li>
                <li> {IterateData(list?.location)}</li>
              </ul>
            </div>
            <div className="d-flex justify-content-end">
              <a href={list?.url?.path} className="view-details">
                View Details
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export const BlogListing = (props: ListingProps): JSX.Element => {
  const [blogListData, setBlogListData] = useState<BlogListingData>();
  const [sortBy, setSortBy] = useState('relevance');
  const path = props?.params?.Scope;
  const template = props?.params?.Template;

  const defaultOrderBy = {
    name: 'Title',
    direction: 'DESC',
  };
  const GetCourseData = async (
    path: string,
    template: string,
    orderBy: ItemSearchOrderByInput = defaultOrderBy
  ): Promise<unknown> => {
    const { data } = await apolloClient.query({
      query: GlobalUniversity_Blog_Listing_Query,
      variables: {
        path: path,
        template: template,
        orderBy: orderBy,
      },
    });
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const courseData = await GetCourseData(path, template);
      setBlogListData(courseData as BlogListingData); // Corrected setter function name
    };

    fetchData();
  }, [path, template]);
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value); // Update the sortBy state with the new value

    // Assuming you want to change the sorting order based on the selection
    let orderByDirection = 'ASC'; // Default sorting order
    if (e?.target?.value === 'Title') {
      orderByDirection = 'DESC'; // Change sorting order if the selected value is 'Title'
    }

    const updatedOrderBy = {
      ...defaultOrderBy,
      direction: orderByDirection,
    };

    // Fetch new course data based on the updated sorting order
    const courseData = await GetCourseData(path, template, updatedOrderBy);
    setBlogListData(courseData as BlogListingData); // Ensure this matches the expected type
  };

  return (
    <div className="container course-listing">
      <div className="row">
        <div className="col-lg-6">
          {blogListData?.BlogListingData?.total == 0 ||
          blogListData?.BlogListingData?.total == undefined ? (
            <h5> No Results</h5>
          ) : (
            <h5>All Blogs {blogListData?.BlogListingData?.total}</h5>
          )}
        </div>
        <div className="col-lg-6">
          <div className="sorting">
            <select
              className="form-select"
              aria-label="Default select example"
              name={'sortby'}
              defaultValue={sortBy}
              onChange={handleChange}
            >
              <option value="title">Sort By : Name </option>
              <option value="relevance">Sort By : Relevance </option>
            </select>
            <div className="sorting-list">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="sorting-grid-view">
              <span></span>
            </div>
          </div>
        </div>
      </div>
      {blogListData?.BlogListingData?.results?.map((list, index) => {
        return (
          <div className="row" key={index}>
            <div className="col-12 col-md-4 course-listing-image">
              <img
                src={list?.thumbnailImage?.jsonValue?.value?.src}
                alt={list?.thumbnailImage?.jsonValue?.value?.alt}
              />
            </div>
            <div className="col-12 col-md-8 course-listing-details">
              <h5>{list?.title?.value} </h5>
              <hr />
            </div>
            <div className="d-flex justify-content-end">
              <a href={list?.url?.path} className="view-details">
                View Details
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Listing;
