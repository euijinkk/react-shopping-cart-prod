import ErrorFallback from 'components/common/ErrorFallback';
import Loading from 'components/common/Loading';
import Pagination from 'components/common/Pagination';
import Snackbar from 'components/common/Snackbar';
import ItemContainer from 'components/ItemList/ItemContainer';
import { MAX_RESULT_ITEM_LIST } from 'constants/index';
import useSnackBar, { MESSAGE } from 'hooks/useSnackBar';
import useThunkFetch from 'hooks/useThunkFetch';
import { useParams } from 'react-router-dom';
import { getCartListRequest } from 'redux/cartList/thunk';
import { getItemList } from 'redux/itemList/thunk';
import styled from 'styled-components';

const ItemList = () => {
  const { id } = useParams();
  const {
    loading,
    data: allItemList,
    error: error_getAllItemList,
  } = useThunkFetch(state => state.itemList, getItemList());
  const { data: cartList, error: error_getCartList } = useThunkFetch(
    state => state.cartList,
    getCartListRequest()
  );
  const { isOpenSnackbar, openSnackbar } = useSnackBar();

  if (loading) return <Loading />;
  if (error_getAllItemList || error_getCartList) return <ErrorFallback />;

  return (
    <StyledRoot>
      {allItemList.length > 0 &&
        allItemList
          .slice(MAX_RESULT_ITEM_LIST * (Number(id) - 1), MAX_RESULT_ITEM_LIST * Number(id))
          .map(item => (
            <ItemContainer
              key={item.id}
              item={item}
              cartItem={cartList.find(cartItem => cartItem.productId === item.id)}
              openSnackbar={openSnackbar}
            />
          ))}
      <Pagination
        endpoint='main'
        count={10}
        lastIndex={Math.floor(allItemList.length / MAX_RESULT_ITEM_LIST) + 1}
      />
      {isOpenSnackbar && <Snackbar message={MESSAGE.cart} />}
    </StyledRoot>
  );
};

export default ItemList;

const StyledRoot = styled.div`
  width: 1300px;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  gap: 2.7rem 5.73rem;
`;
