// Code generated by "stringer -type=Variant"; DO NOT EDIT.

package change

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[Set-1]
	_ = x[Delete-2]
}

const _Variant_name = "SetDelete"

var _Variant_index = [...]uint8{0, 3, 9}

func (i Variant) String() string {
	i -= 1
	if i >= Variant(len(_Variant_index)-1) {
		return "Variant(" + strconv.FormatInt(int64(i+1), 10) + ")"
	}
	return _Variant_name[_Variant_index[i]:_Variant_index[i+1]]
}
