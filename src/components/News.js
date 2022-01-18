import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

function News(props) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  
  
  const capitalize=(name)=>{
    return name.charAt(0).toUpperCase()+name.slice(1);
  }

    

    const updateNews= async()=>{
      props.setProgress(10);
      const url= `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
      // this.setState({loading: true});
      setLoading(true);
      let data= await fetch(url);
      props.setProgress(30);
      let parsedData= await data.json();
      props.setProgress(70);
       console.log(parsedData);
       setArticles(parsedData.articles);
       setTotalResults(parsedData.totalResults);
       setLoading(false);
      props.setProgress(100);
    }

    useEffect(() => {
      document.title= `${capitalize(props.category)} - NewsDose `;
      updateNews();
    }, [])

   
    const handleNext= async()=>{
     
      setPage(page+1);
      updateNews();
    }

    const handlePrev= async()=>{
   
      setPage(page-1);
      updateNews();
    }

   const fetchMoreData = async () => {
    //  this.setState({page: this.state.page + 1})
    
     const url= `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    //  this.setState({loading: true});
    setPage(page+1);
     let data= await fetch(url);
     let parsedData= await data.json();
      console.log(parsedData);
      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
    //  this.setState({
    //    articles: this.state.articles.concat(parsedData.articles),
    //    totalResults: parsedData.totalResults,
    //    loading: false
    //  })
    };
        return (
            <>
            <h1 className="text-center" style={{margin: '35px 0px', marginTop: "90px", color: "red"}} >NewsAlert- Top {capitalize(props.category)} Headlines </h1>
             {loading && <Spinner />}
             <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<h4><Spinner /></h4>}
        >
        <div className="container">
                <div className="row">
                {articles.map((element) => {
                    return <div className="col-md-4"  key={element.url}>
                <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url}
                  author={element.author} date={element.publishedAt}  source={element.source.name}
                />
                </div>
                })}
                </div>
                </div>
                </InfiniteScroll>
        </>
        )
    }

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general"
}

News.propTypes = {
 country: PropTypes.string,
 pageSize: PropTypes.number,
 category: PropTypes.string,
}


export default News
